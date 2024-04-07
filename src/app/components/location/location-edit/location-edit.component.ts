import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { CurrentPicComponent } from '@components/current-pic/current-pic.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'lt-location-edit',
  standalone: true,
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
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
    ImagePathPipe,
  ],
  templateUrl: './location-edit.component.html',
  styleUrl: './location-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly locationService = inject(LocationService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly errorHandler = inject(ErrorHandlerService);

  protected locationForm: FormGroup = this.fb.group({
    name: new FormControl('', { validators:  Validators.required }),
    light: new FormControl('FULLSUN', { validators: Validators.required }),
    public: new FormControl(true),
    pictureFile: new FormControl<File | null>(null),
  });
  protected location$?: Observable<Location>;
  protected removePicture: boolean = false;
  protected disableNavigation: boolean = false;
  private id?: number;

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['locationId'];

    if (this.id) {
      this.location$ = this.locationService.get(this.id).pipe(
        tap((location) => {
          Object.keys(this.locationForm.value).forEach((key) => {
            this.locationForm.controls[key].setValue(
              location[key as keyof Location],
            );
          });

          this.breadcrumb.setNavigation(
            [{ selector: 'location-edit', name: 'Edit location' }],
            { attachTo: 'location' },
          );
        }),
        catchError((err: HttpErrorResponse) => {
          this.errorHandler.push(
            $localize`:@@location.invalid:Location invalid or not found`,
          );

          return EMPTY;
        }),
      );
    }
  }

  submit(): void {
    if (!this.id || !this.locationForm.valid) return;

    const data = {
      ...this.locationForm.value,
      id: this.id,
    };

    this.disableNavigation = true;

    this.locationService.update(data, { removePicture: this.removePicture })
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

  toggleRemovePicture(val: boolean) {
    this.removePicture = val;
  }
}
