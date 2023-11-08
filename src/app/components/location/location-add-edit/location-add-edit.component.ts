import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';

import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import { WizardModule } from '@modules/wizard/wizard.module';
import { Location, Light } from '@models/location.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ImagePathService } from '@services/image-path.service';
import { LocationService } from '@services/location.service';

@Component({
  standalone: true,
  selector: 'lt-location-add-edit',
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
  disableNavigation: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public locationService: LocationService,
    private breadcrumb: BreadcrumbService,
    private errorHandler: ErrorHandlerService,
    public imagePath: ImagePathService
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

      this.locationService.get(this.id).pipe(
        catchError((err: HttpErrorResponse) => {
          this.errorHandler.push(
            $localize `:@@location.invalid:Location invalid or not found`
          );

          return EMPTY;
        })
      )
      .subscribe((location: Location) => {
        this.location = location;

        Object.keys(this.locationForm.value).forEach((key) => {
          this.locationForm.controls[key]
            .setValue(location[key as keyof Location]);
        });

        this.breadcrumb.setNavigation(
          [{ selector: 'location-edit', name: 'Edit location' }],
          { attachTo: 'location' }
        );
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
    if (!this.createNew && !this.id) return;

    const data: Location = this.locationForm.value;
    let insert: Observable<Location> | undefined;

    if (this.createNew) insert = this.locationService.create(data);
    else if (this.id) {
      data.id = this.id;
      insert = this.locationService.update(data, {
        removePicture: this.removePicture
      });
    }

    this.disableNavigation = true;

    if (insert) {
      insert.pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') {
            this.errorHandler.push(
              $localize `:@@errors.invalidImg:Invalid image.`
            );
          }

          return EMPTY;
        }),
        finalize(() => {
          this.disableNavigation = false;
        })
      ).subscribe((location: Location) => {
        this.router.navigate([`location/${location.id}`]);
      });
    }
  }

  toggleRemovePicture(event: Event) {
    this.removePicture = (event.target as HTMLInputElement).checked;
  }

}
