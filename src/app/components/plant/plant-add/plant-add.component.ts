import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, EMPTY, finalize, map, Observable, switchMap } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { ProgressBarComponent } from '@components/progress-bar/progress-bar.component';
import { SpecieFinderComponent } from '@components/specie-finder/specie-finder.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { PlantFormNameComponent } from '@components/plant/forms/plant-form-name/plant-form-name.component';
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { LocationService } from '@services/location.service';
import { BackendResponse } from '@models/backend-response.model';

@Component({
  standalone: true,
  selector: 'lt-plant-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    FileUploaderComponent,
    ProgressBarComponent,
    SpecieFinderComponent,
    FormPrivacyComponent,
    PlantFormNameComponent,
  ],
  templateUrl: './plant-add.component.html',
  styleUrls: ['./plant-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantAddComponent {
  protected plantForm: FormGroup = this.fb.group({
    specieId: [],
    customName: [],
    public: [true, Validators.required],
  });
  protected photosForm: FormGroup = this.fb.group({
    pictureFiles: new FormControl<File[] | null>(null),
  });
  private locationId?: number;
  protected newPlantId?: number;
  protected location$?: Observable<Location>;
  protected createPlantProgress$?: Observable<number>;
  protected disableNavigation: boolean = false;

  constructor(
    private readonly locationService: LocationService,
    private readonly plantService: PlantService,
    private readonly photoService: PhotoService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.params['locationId'];

    if (this.locationId) {
      this.location$ = this.locationService.get(this.locationId).pipe(
        catchError(() => {
          this.errorHandler.push(
            $localize`:@@plant-add.location:Invalid location provided.`,
          );

          return EMPTY;
        }),
      );
    }
  }

  submit() {
    if (!this.locationId) return;

    const plant: Plant = this.plantForm.value;
    const { pictureFiles } = this.photosForm.value;

    plant.locationId = this.locationId;
    this.disableNavigation = true;

    if (pictureFiles && pictureFiles.length > 0) {
      this.createPlantProgress$ = this.plantService.create(plant)
        .pipe(
          switchMap((plant: Plant) => {
            const photos = {
              plantId: plant.id,
              public: plant.public,
              pictureFiles,
            } as Photo;

            return this.photoService.create(photos, true).pipe(
              catchError(() => {
                // Plant is created even though photo upload may have failed.
                // So we redirect to Plant.
                this.router.navigate(['/plant', plant.id]);

                return EMPTY;
              }),
            );
          }),
          map((event: HttpEvent<BackendResponse>) => {
            let uploadProgress: number = 0;

            switch (event.type) {
              case HttpEventType.UploadProgress: {
                const eventTotal = event.total ?? 0;
                uploadProgress = Math.round(
                  (event.loaded / eventTotal) * 100,
                );
                break;
              }
              case HttpEventType.Response: {
                if (event.body?.data?.plantId) {
                  uploadProgress = 0;
                  this.router.navigate(['/plant', event.body.data.plantId]);
                }
                break;
              }
            }

            return uploadProgress;
          }),
          finalize(() => {
            this.disableNavigation = false;
          }),
        )
    } else {
      this.createPlantProgress$ = this.plantService.create(plant)
        .pipe(
          catchError(() => {
            this.errorHandler.push(
              $localize`:@@plant-add.create:Error when creating the plant.`,
            );

            return EMPTY;
          }),
          map((plant: Plant) => {
            this.router.navigate(['/plant', plant.id], { replaceUrl: true });

            return 100;
          }),
          finalize(() => {
            this.disableNavigation = false;
          }),
        )
    }
  }
}
