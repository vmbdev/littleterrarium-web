import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { WizardModule } from '@modules/wizard/wizard.module';
import { Location, Light } from '@interfaces';

@Component({
  standalone: true,
  selector: 'location-add-edit',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FileUploaderComponent,
    WizardModule
  ],
  templateUrl: './location-add-edit.component.html',
  styleUrls: ['./location-add-edit.component.scss']
})
export class LocationAddEditComponent implements OnInit {
  lightOptions = Light;
  locationForm: FormGroup;
  location?: Location;
  id?: number;
  createNew: boolean = false;
  created: boolean = false;
  edited: boolean = false;
  removePicture: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private breadcrumb: BreadcrumbService,
    private errorHandler: ErrorHandlerService
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      light: ['FULLSUN', Validators.required],
      public: [true],
      pictureFile: [],
    })
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['locationId'];
    this.createNew = !paramId;

    // editing
    if (!this.createNew && +paramId) {
      this.id = +paramId;

      this.api.getLocation(this.id).subscribe({
        next: (location: Location) => {
          this.location = location;

          Object.keys(this.locationForm.value).forEach((key) => {
            this.locationForm.controls[key].setValue(location[key as keyof Location]);
          });

          this.breadcrumb.setNavigation([
            { id: 'location-edit', name: 'Edit location' }
          ], { attachTo: 'location' });
        },
        error: () => {
          this.errorHandler.push($localize `:@@location.invalid:Location invalid or not found`);
        }
      })
    }
  }

  control(name: string): FormControl {
    return this.locationForm.get(name) as FormControl;
  };

  fileChange(files: File[]) {
    this.locationForm.patchValue({
      pictureFile: files[0]
    });
  }

  submit(): void {
    const data: Location = this.locationForm.value;
    let insert: Observable<any> | undefined;

    if (this.createNew) insert = this.api.createLocation(data);
    else if (this.id) {
      data.id = this.id;
      insert = this.api.updateLocation(data, this.removePicture);
    }

    if (insert) {
      insert.pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push($localize `:@@errors.invalidImg:Invalid image.`);

          return EMPTY;
        })
      ).subscribe((res: any) => {
        if (res.msg === 'LOCATION_CREATED') this.router.navigate([`location/${res.data.location.id}`]);
        else if (res.msg === 'LOCATION_UPDATED') this.router.navigate([`location/${data.id}`]);
      });
    }
  }

  toggleRemovePicture(event: Event) {
    this.removePicture = (event.target as HTMLInputElement).checked;
  }

}
