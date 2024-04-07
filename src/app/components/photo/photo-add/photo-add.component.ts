import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { ProgressBarComponent } from '@components/progress-bar/progress-bar.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-photo-add',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    FileUploaderComponent,
    ProgressBarComponent,
    FormPrivacyComponent,
  ],
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoAddComponent {
  protected photoForm: FormGroup;
  private plantId?: number;
  protected createPhotoProgress$?: Observable<number>;
  protected plant$?: Observable<Plant | null>;
  protected disableNavigation: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly photoService: PhotoService,
    private readonly plantService: PlantService,
    private readonly errorHandler: ErrorHandlerService,
  ) {
    this.photoForm = this.fb.group({
      public: [true, Validators.required],
      pictureFiles: new FormControl<File[]>([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (this.plantId) {
      this.plant$ = this.plantService.get(this.plantId).pipe(
        catchError((err: HttpErrorResponse) => {
          this.router.navigateByUrl('/');

          if (err.error?.msg === 'PLANT_NOT_FOUND') {
            this.errorHandler.push(
              $localize`:@@plant.invalid:Plant not found.`,
            );

            return EMPTY;
          } else return throwError(() => err);
        }),
        switchMap(() => this.plantService.plant$),
      );
    } else {
      this.errorHandler.push($localize`:@@plant.invalid:Plant not found.`);
    }
  }

  submit(): void {
    if (!this.plantId || !this.photoForm.valid) return;

    const newPhoto: Photo = this.photoForm.value;

    newPhoto.plantId = this.plantId;
    this.disableNavigation = true;

    this.createPhotoProgress$ = this.photoService.create(newPhoto).pipe(
      map((event) => {
        let uploadProgress: number = 0;

        switch (event.type) {
          case HttpEventType.UploadProgress: {
            const eventTotal = event.total ? event.total : 0;
            uploadProgress = Math.round((event.loaded / eventTotal) * 100);
            break;
          }
          case HttpEventType.Response: {
            uploadProgress = 0;
            this.router.navigate(['plant', this.plantId]);
            break;
          }
        }

        return uploadProgress;
      }),
      finalize(() => {
        this.disableNavigation = false;
      }),
    );
  }
}
