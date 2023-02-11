import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, of, switchMap } from 'rxjs';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';
import { Location, Photo, Plant } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'plant-add',
  templateUrl: './plant-add.component.html',
  styleUrls: ['./plant-add.component.scss']
})
export class PlantAddComponent implements OnInit {
  plantForm: FormGroup;
  locationId?: number;
  newPlantId?: number;
  location?: Location;
  photos: File[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService
  ) {
    this.plantForm = this.fb.group({
      specieId: [],
      customName: [],
      public: [true, Validators.required]
    })
  }

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.params['locationId'];

    if (this.locationId) {
      this.api.getLocation(this.locationId).subscribe({
        next: (location: Location) => { this.location = location },
        error: () => { this.errorHandler.push($localize `:@@plant-add.location:Invalid location provided.`) }
      });
    }
  }

  fileChange(files: File[]) {
    this.photos = files;
  }

  selectSpecieId(id: any): void {
    this.plantForm.patchValue({
      specieId: id
    });
  }

  submit() {
    if (!this.locationId) return;

    const plant: Plant = this.plantForm.value;
    plant.locationId = this.locationId;

    this.api.createPlant(plant).pipe(
      switchMap((res: any) => {
        const plant: Plant = res.plant;
        this.newPlantId = plant.id;

        if (this.photos.length === 0) return of(true);
        else {
          const photos = {
            plantId: plant.id,
            public: plant.public,
            pictureFiles: this.photos
          } as Photo;
          
          return this.api.createPhoto(photos);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push($localize `:@@errors.invalidImg:Invalid image.`);
          this.router.navigate(['/plant', this.newPlantId]);
        }
        else this.errorHandler.push($localize `:@@plant-add.create:Error when creating the plant.`);

        return EMPTY;
      })
    ).subscribe(() => {
      this.router.navigate(['/plant', this.newPlantId])
    });
  }
}
