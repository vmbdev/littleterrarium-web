import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Plant, Photo } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'photo-add',
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.scss']
})
export class PhotoAddComponent implements OnInit {
  photoForm: FormGroup;
  plantId!: number;
  plant!: Plant;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.photoForm = this.fb.group({
      public: [true, Validators.required],
      pictureFiles: [Validators.required],
    })
  }

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (!this.plantId) console.error('Plant invalid');
    else {
      this.api.getPlant(this.plantId).subscribe({
        next: (plant: Plant) => { this.plant = plant },
        error: () => { console.error('Plant not found') }
      });
    }
  }

  fileChange(files: File[]) {
    this.photoForm.patchValue({
      pictureFiles: files
    });
  }

  submit(): void {
    const data: Photo = this.photoForm.value;
    data.plantId = this.plantId;

    this.api.createPhoto(data).subscribe({
      next: () => {
        this.router.navigate(['plant', this.plantId])
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

}
