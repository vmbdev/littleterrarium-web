import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateTime } from 'luxon';

import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';

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

  constructor(private fb: FormBuilder, public photoService: PhotoService) {
    this.photoForm = this.fb.group({
      description: [],
      takenAt: [DateTime.now().toFormat('yyyy-LL-dd'), Validators.required],
      public: [],
    });
  }

  ngOnInit(): void {
    this.photoService.photo$.subscribe((photo: Photo | null) => {
      if (photo) {
        this.photoForm.setValue({
          description: photo.description,
          takenAt: DateTime.fromISO(photo.takenAt as string).toFormat(
            'yyyy-LL-dd'
          ),
          public: photo.public,
        });
      }
    });
  }

  today(): string {
    return DateTime.now().toFormat('yyyy-LL-dd');
  }

  submit(): void {
    const current = this.photoService.photo$.getValue();

    if (current) {
      const updatedPhoto: Photo = this.photoForm.value;
      updatedPhoto.id = current.id;

      this.photoService.update(updatedPhoto).subscribe(() => {
        this.updated.emit();
      });
    }
  }
}
