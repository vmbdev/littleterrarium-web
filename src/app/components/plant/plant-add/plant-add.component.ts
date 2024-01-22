import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import {
  FormBuilder,
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
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { LocationService } from '@services/location.service';

@Component({
  standalone: true,
  selector: 'lt-plant-add',
  imports: [
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    FileUploaderComponent,
    ReactiveFormsModule,
    ProgressBarComponent,
    SpecieFinderComponent,
  ],
  templateUrl: './plant-add.component.html',
  styleUrls: ['./plant-add.component.scss'],
})
export class PlantAddComponent {
  protected plantForm: FormGroup = this.fb.group({
    specieId: [],
    customName: [],
    public: [true, Validators.required],
  });
  private locationId?: number;
  protected newPlantId?: number;
  protected location?: Location;
  private photos: File[] = [];
  protected uploadProgress: number = 0;
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
      this.locationService.get(this.locationId).subscribe({
        next: (location: Location) => {
          this.location = location;
        },
        error: () => {
          this.errorHandler.push(
            $localize`:@@plant-add.location:Invalid location provided.`,
          );
        },
      });
    }
  }

  fileChange(files: File[]) {
    this.photos = files;
  }

  selectSpecieId(id: any): void {
    this.plantForm.patchValue({
      specieId: id,
    });
  }

  submit() {
    if (!this.locationId) return;

    const plant: Plant = this.plantForm.value;

    plant.locationId = this.locationId;
    this.disableNavigation = true;

    const obs = this.plantService.create(plant);

    if (this.photos.length > 0) {
      obs
        .pipe(
          switchMap((plant: Plant) => {
            const photos = {
              plantId: plant.id,
              public: plant.public,
              pictureFiles: this.photos,
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
          finalize(() => {
            this.disableNavigation = false;
          }),
        )
        .subscribe((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              this.uploadProgress = Math.round(
                (event.loaded / eventTotal) * 100,
              );
              break;
            }
            case HttpEventType.Response: {
              this.uploadProgress = 0;
              this.router.navigate(['/plant', event.body?.data?.plantId]);
              break;
            }
          }
        });
    } else {
      obs
        .pipe(
          finalize(() => {
            this.disableNavigation = false;
          }),
        )
        .subscribe({
          next: (plant: Plant) => {
            this.router.navigate(['/plant', plant.id], { replaceUrl: true });
          },
          error: () => {
            this.errorHandler.push(
              $localize`:@@plant-add.create:Error when creating the plant.`,
            );
          },
        });
    }
  }
}
