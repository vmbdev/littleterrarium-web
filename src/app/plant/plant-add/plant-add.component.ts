import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';
import { Location, Photo, Plant } from 'src/app/interfaces';
import { PlantService } from 'src/app/plant-service/plant.service';
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
  uploadProgress: number = 0;

  constructor(
    private api: ApiService,
    private plantService: PlantService,
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
    
    this.plantService.create(plant, this.photos).subscribe({
      next: (event) => {
        if (event?.msg === 'PLANT_CREATED') this.router.navigate(['/plant', event.data.plant.id]);
        else {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              this.uploadProgress = Math.round(event.loaded / eventTotal * 100);
              break;
            }
            case HttpEventType.Response: {
              if (event.body.msg === 'PHOTOS_CREATED') {
                this.uploadProgress = 0;
              }

              this.router.navigate(['/plant', event.body.data.plantId])
              break;
            }
          }
        }
      },
      error: () => {
        this.errorHandler.push($localize `:@@plant-add.create:Error when creating the plant.`);
      }
    });
  }
}
