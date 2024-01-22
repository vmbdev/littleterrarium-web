import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize, throwError } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import {
  WizardHeaderComponent
} from '@components/wizard/wizard-header/wizard-header.component';
import {
  WizardPageDescriptionComponent
} from '@components/wizard/wizard-page-description/wizard-page-description.component';
import {
  WizardPageComponent
} from '@components/wizard/wizard-page/wizard-page.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  ProgressBarComponent
} from '@components/progress-bar/progress-bar.component';
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
  ],
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.scss'],
})
export class PhotoAddComponent {
  protected photoForm: FormGroup;
  private plantId?: number;
  protected plant?: Plant;
  protected uploadProgress: number = 0;
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
      pictureFiles: [Validators.required],
    });
  }

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (this.plantId) {
      this.plantService
        .get(this.plantId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.router.navigateByUrl('/');

            if (err.error?.msg === 'PLANT_NOT_FOUND') {
              this.errorHandler.push(
                $localize`:@@plant.invalid:Plant not found.`
              );

              return EMPTY;
            } else return throwError(() => err);
          })
        )
        .subscribe((plant: Plant) => {
          this.plant = plant;
        });
    } else {
      this.errorHandler.push($localize`:@@plant.invalid:Plant not found.`);
    }
  }

  fileChange(files: File[]) {
    this.photoForm.patchValue({
      pictureFiles: files,
    });
  }

  submit(): void {
    if (this.plantId) {
      const newPhoto: Photo = this.photoForm.value;

      newPhoto.plantId = this.plantId;
      this.disableNavigation = true;

      this.photoService
        .create(newPhoto)
        .pipe(
          finalize(() => {
            this.disableNavigation = false;
          })
        )
        .subscribe((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              this.uploadProgress = Math.round(
                (event.loaded / eventTotal) * 100
              );
              break;
            }
            case HttpEventType.Response: {
              this.uploadProgress = 0;
              this.router.navigate(['plant', this.plantId]);
              break;
            }
          }
        });
    }
  }
}
