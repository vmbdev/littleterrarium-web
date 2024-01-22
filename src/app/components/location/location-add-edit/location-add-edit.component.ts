import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { CurrentPicComponent } from '@components/current-pic/current-pic.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { LocationService } from '@services/location.service';
import { Location, Light } from '@models/location.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

type LightOptionType = {
  value: string;
  name: string;
  desc: string;
};

@Component({
  standalone: true,
  selector: 'lt-location-add-edit',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FileUploaderComponent,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    CurrentPicComponent,
    ImagePathPipe,
  ],
  templateUrl: './location-add-edit.component.html',
  styleUrls: ['./location-add-edit.component.scss'],
})
export class LocationAddEditComponent {
  protected locationForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    light: ['FULLSUN', Validators.required],
    public: [true],
    pictureFile: [],
  });
  protected location?: Location;
  protected createNew: boolean = false;
  protected removePicture: boolean = false;
  protected disableNavigation: boolean = false;
  protected lightOptions: LightOptionType[] = [];
  private id?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly locationService: LocationService,
    private readonly breadcrumb: BreadcrumbService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['locationId'];
    this.createNew = !paramId;

    // editing
    if (!this.createNew && +paramId) {
      this.id = +paramId;

      this.locationService
        .get(this.id)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorHandler.push(
              $localize`:@@location.invalid:Location invalid or not found`,
            );

            return EMPTY;
          }),
        )
        .subscribe((location: Location) => {
          this.location = location;

          Object.keys(this.locationForm.value).forEach((key) => {
            this.locationForm.controls[key].setValue(
              location[key as keyof Location],
            );
          });

          this.breadcrumb.setNavigation(
            [{ selector: 'location-edit', name: 'Edit location' }],
            { attachTo: 'location' },
          );
        });
    }

    this.lightOptions = this.createLightOptions();
  }

  control(name: string): FormControl {
    return this.locationForm.get(name) as FormControl;
  }

  hasFormError(name: string): boolean {
    return (
      this.control('name').errors?.['required'] && this.control('name').dirty
    );
  }

  createLightOptions(): LightOptionType[] {
    const opts: LightOptionType[] = [];

    for (const option of Object.keys(Light)) {
      opts.push({
        value: option,
        name: this.locationService.getLightName(option),
        desc: this.locationService.getLightDesc(option),
      });
    }

    return opts;
  }

  fileChange(files: File[]) {
    this.locationForm.patchValue({
      pictureFile: files[0],
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
        removePicture: this.removePicture,
      });
    }

    this.disableNavigation = true;

    if (insert) {
      insert
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.error?.msg === 'IMG_NOT_VALID') {
              this.errorHandler.push(
                $localize`:@@errors.invalidImg:Invalid image.`,
              );
            }

            return EMPTY;
          }),
          finalize(() => {
            this.disableNavigation = false;
          }),
        )
        .subscribe((location: Location) => {
          this.router.navigate([`location/${location.id}`]);
        });
    }
  }

  toggleRemovePicture(val: boolean) {
    this.removePicture = val;
  }
}
