import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { WizardModule } from '@modules/wizard/wizard.module';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { ProgressBarComponent } from '@components/progress-bar/progress-bar.component';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'photo-add',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    WizardModule,
    FileUploaderComponent,
    ProgressBarComponent
  ],
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.scss']
})
export class PhotoAddComponent implements OnInit {
  photoForm: FormGroup;
  plantId?: number;
  plant?: Plant;
  uploadProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private plantService: PlantService,
    private errorHandler: ErrorHandlerService
  ) {
    this.photoForm = this.fb.group({
      public: [true, Validators.required],
      pictureFiles: [Validators.required],
    })
  }

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (this.plantId) {
      this.plantService.get(this.plantId).pipe(
        catchError((err: HttpErrorResponse) => {
          this.router.navigateByUrl('/');

          if (err.error?.msg === 'PLANT_NOT_FOUND') {
            this.errorHandler.push($localize `:@@plant.invalid:Plant not found.`);
            return EMPTY;
          }
          else return throwError(() => err);  
        })
      ).subscribe((plant: Plant) => {
        this.plant = plant
      });
    }
    else {
      this.errorHandler.push($localize `:@@plant.invalid:Plant not found.`);
    }
  }

  fileChange(files: File[]) {
    this.photoForm.patchValue({
      pictureFiles: files
    });
  }

  submit(): void {
    if (this.plantId) {
      const newPhoto: Photo = this.photoForm.value;

      newPhoto.plantId = this.plantId;

      this.photoService.create(newPhoto).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            const eventTotal = event.total ? event.total : 0;
            this.uploadProgress = Math.round(event.loaded / eventTotal * 100);
            break;
          }
          case HttpEventType.Response: {
            if (event.body.msg === 'PHOTOS_CREATED') {
              this.uploadProgress = 0;
              this.router.navigate(['plant', this.plantId])
            }
            break;
          }

        }
      });
    }
  }

}
