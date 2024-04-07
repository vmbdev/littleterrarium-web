import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EMPTY, Observable, map, switchMap, withLatestFrom } from 'rxjs';
import { DateTime } from 'luxon';

import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { PhotoFormDescriptionComponent } from '@components/photo/forms/photo-form-description/photo-form-description.component';
import { PhotoFormDateComponent } from '@components/photo/forms/photo-form-date/photo-form-date.component';
import { PhotoFormCoverComponent } from '@components/photo/forms/photo-form-cover/photo-form-cover.component';
import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-photo-edit',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormPrivacyComponent,
    PhotoFormDescriptionComponent,
    PhotoFormDateComponent,
    PhotoFormCoverComponent,
  ],
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditComponent {
  @Output() updated = new EventEmitter<null>();
  protected photoForm: FormGroup = this.fb.group({
    description: [],
    takenAt: [DateTime.now().toFormat('yyyy-LL-dd'), Validators.required],
    coverId: [],
    public: [],
  });
  protected photo$?: Observable<Photo | null>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly photoService: PhotoService,
    private readonly plantService: PlantService,
  ) {}

  ngOnInit(): void {
    const obs$ = this.photoService.photo$;

    this.photo$ = obs$.pipe(
      switchMap((photo: Photo | null) => {
        if (photo) return this.plantService.getCover(photo.plantId);
        else return EMPTY;
      }),
      withLatestFrom(obs$),
      map(([{ coverId }, photo]) => {
        if (!photo) return null;

        this.photoForm.setValue({
          description: photo.description,
          takenAt: DateTime.fromISO(photo.takenAt as string).toFormat(
            'yyyy-LL-dd',
          ),
          coverId: coverId === photo.id,
          public: photo.public,
        });

        return photo;
      }),
    );
  }

  submit(): void {
    const currentPhoto = this.photoService.current();

    if (currentPhoto && this.photoForm.valid) {
      let plant: Plant;
      const updatedPhoto = this.photoForm.value;

      // if we selected/deselected the cover photo
      // avoid updating the plant when not necessary
      if (this.photoForm.get('coverId')?.dirty) {
        plant = {
          id: currentPhoto.plantId,
          coverId: updatedPhoto.coverId ? currentPhoto.id : null,
        } as Plant;
      }
      delete updatedPhoto.coverId;

      updatedPhoto.id = currentPhoto.id;

      this.photoService
        .update(updatedPhoto)
        .pipe(
          switchMap(() => {
            if (plant) return this.plantService.update(plant);
            else {
              this.updated.emit();
              return EMPTY;
            }
          }),
        )
        .subscribe(() => {
          this.updated.emit();
        });
    }
  }
}
