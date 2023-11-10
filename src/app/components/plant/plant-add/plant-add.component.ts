import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  WizardHeaderComponent
} from '@components/wizard/wizard-header/wizard-header.component';
import {
  WizardPageDescriptionComponent
} from '@components/wizard/wizard-page-description/wizard-page-description.component';
import {
  WizardPageComponent
} from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  ProgressBarComponent
} from '@components/progress-bar/progress-bar.component';
import {
  SpecieFinderComponent
} from '@components/specie-finder/specie-finder.component';
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { ApiService } from '@services/api.service';

@Component({
  standalone: true,
  selector: 'lt-plant-add',
  imports: [
    CommonModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    FileUploaderComponent,
    ReactiveFormsModule,
    ProgressBarComponent,
    SpecieFinderComponent
  ],
  templateUrl: './plant-add.component.html',
  styleUrls: ['./plant-add.component.scss']
})
export class PlantAddComponent {
  plantForm: FormGroup;
  locationId?: number;
  newPlantId?: number;
  location?: Location;
  photos: File[] = [];
  uploadProgress: number = 0;
  disableNavigation: boolean = false;

  constructor(
    private api: ApiService,
    private plantService: PlantService,
    private photoService: PhotoService,
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
        error: () => {
          this.errorHandler.push(
            $localize `:@@plant-add.location:Invalid location provided.`
          )
        }
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
    this.disableNavigation = true;
    
    const obs = this.plantService.create(plant);
    
    if (this.photos.length > 0) {
      obs.pipe(
        switchMap((plant: Plant) => {
          const photos = {
            plantId: plant.id,
            public: plant.public,
            pictureFiles: this.photos
          } as Photo;
  
          return this.photoService.create(photos, true).pipe(
            catchError(() => {
              // Plant is created even though photo upload may have failed.
              // So we redirect to Plant.
              this.router.navigate(['/plant', plant.id]);
      
              return EMPTY;
            }))
        }),
        finalize(() => { this.disableNavigation = false }),
      ).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            const eventTotal = event.total ? event.total : 0;
            this.uploadProgress = Math.round(event.loaded / eventTotal * 100);
            break;
          }
          case HttpEventType.Response: {
            this.uploadProgress = 0;
            this.router.navigate(['/plant', event.body.data.plantId])
            break;
          }
        }
      });
    }
    else {
      obs.pipe(
        finalize(() => { this.disableNavigation = false })
      ).subscribe({
        next: (plant: Plant) => {
          this.router.navigate(['/plant', plant.id], { replaceUrl: true });
        },
        error: () => {
          this.errorHandler.push(
            $localize `:@@plant-add.create:Error when creating the plant.`
          );
        }
      })
    }
  }
}
