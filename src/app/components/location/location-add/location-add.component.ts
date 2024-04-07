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
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';

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
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  standalone: true,
  selector: 'lt-location-add',
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
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly locationService = inject(LocationService);
  private readonly errorHandler = inject(ErrorHandlerService);

  protected locationForm: FormGroup = this.fb.group({
    name: new FormControl('', { validators:  Validators.required }),
    light: new FormControl('FULLSUN', { validators: Validators.required }),
    public: new FormControl(true),
    pictureFile: new FormControl<File | null>(null),
  });
  protected disableNavigation: boolean = false;

  submit(): void {
    if (!this.locationForm.valid) return;

    const data: Location = this.locationForm.value;

    this.disableNavigation = true;

    this.locationService.create(data)
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
