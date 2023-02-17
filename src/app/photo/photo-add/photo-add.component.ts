import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, throwError } from 'rxjs';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';
import { Plant, Photo } from 'src/app/interfaces';
import { PlantService } from 'src/app/plant/plant.service';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'photo-add',
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
