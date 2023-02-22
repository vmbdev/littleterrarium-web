import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as dayjs from 'dayjs';
import { Photo } from '@models/photo.model';
import { PhotoService } from '@services/photo.service';

@Component({
  standalone: true,
  selector: 'photo-edit',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.scss']
})
export class PhotoEditComponent implements OnInit {
  @Output() updated: EventEmitter<null> = new EventEmitter<null>();
  photoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public photoService: PhotoService
  ) {
    this.photoForm = this.fb.group({
      description: [],
      takenAt: [dayjs().format('YYYY-MM-DD'), Validators.required],
      public: []
    })
  }

  ngOnInit(): void {
    this.photoService.photo$.subscribe((photo: Photo | null) => {
      if (photo) {
        this.photoForm.setValue({
          description: photo.description,
          takenAt: dayjs(photo.takenAt).format('YYYY-MM-DD'),
          public: photo.public
        })
      }
    })
  }

  submit(): void {
    const current = this.photoService.photo$.getValue();

    if (current) {
      const updatedPhoto: Photo = this.photoForm.value;
      updatedPhoto.id = current.id;
  
      this.photoService.update(updatedPhoto).subscribe(() => {
        this.updated.emit();
      })
    }
  }

}
