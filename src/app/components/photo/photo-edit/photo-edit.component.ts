import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EMPTY, switchMap, withLatestFrom } from 'rxjs';
import { DateTime } from 'luxon';

import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-photo-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.scss'],
})
export class PhotoEditComponent {
  @Output() updated = new EventEmitter<null>();
  photoForm: FormGroup;
  plantCoverId?: number;
  today = DateTime.now().toFormat('yyyy-LL-dd');

  constructor(
    private readonly fb: FormBuilder,
    public readonly photoService: PhotoService,
    private readonly plantService: PlantService,
  ) {
    this.photoForm = this.fb.group({
      description: [],
      takenAt: [DateTime.now().toFormat('yyyy-LL-dd'), Validators.required],
      coverId: [],
      public: [],
    });
  }

  ngOnInit(): void {
    const obs$ = this.photoService.photo$;
    
    obs$.pipe(
      switchMap((photo: Photo | null) => {
        if (photo) return this.plantService.getCover(photo.plantId);

        return EMPTY;
      }),
      withLatestFrom(obs$)
    ).subscribe(([{ coverId }, photo]) => {
      if (photo) {
        this.photoForm.setValue({
          description: photo.description,
          takenAt: DateTime.fromISO(photo.takenAt as string).toFormat(
            'yyyy-LL-dd'
          ),
          coverId: coverId === photo.id,
          public: photo.public,
        });
      }
    });
  }

  updateCoverPhoto(): void {
    const photo = this.photoService.getValue();

    if (photo) {
      if (photo.id === this.plantCoverId) {
        const plant = { id: photo.plantId } as Plant;
        this.plantService.update(plant, { removeCover: true }).subscribe(() => {
          this.plantCoverId = undefined;
        });
      } else {
        const plant = { id: photo.plantId, coverId: photo.id } as Plant;

        this.plantService.update(plant).subscribe(() => {
          this.plantCoverId = photo.id;
        });
      }
    }
  }

  submit(): void {
    const currentPhoto = this.photoService.getValue();

    if (currentPhoto) {
      let plant: Plant;
      const updatedPhoto = this.photoForm.value;
      
      // if we selected/deselected the cover photo
      // avoid updating the plant when not necessary
      if (this.photoForm.get('coverId')?.dirty) {
        plant = {
          id: currentPhoto.plantId,
          coverId: updatedPhoto.coverId ? currentPhoto.id : null
        } as Plant;
      }
      delete updatedPhoto.coverId;
      
      updatedPhoto.id = currentPhoto.id;

      this.photoService.update(updatedPhoto).pipe(
        switchMap(() => {
          if (plant) return this.plantService.update(plant)
          else {
            this.updated.emit();
            return EMPTY;
          }
        })
      ).subscribe(() => {
        this.updated.emit();
      });
    }
  }
}
