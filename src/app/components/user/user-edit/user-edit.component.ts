import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ImageSelectorComponent } from '@components/image-selector/image-selector.component';
import { UserFormBioComponent } from '@components/user/forms/user-form-bio/user-form-bio.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { UserFormNameComponent } from '@components/user/forms/user-form-name/user-form-name.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  standalone: true,
  selector: 'lt-user-edit',
  imports: [
    CommonModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    ReactiveFormsModule,
    RouterModule,
    FormPrivacyComponent,
    UserFormBioComponent,
    UserFormEmailComponent,
    UserFormNameComponent,
    UserFormUsernameComponent,
    ImageSelectorComponent,
    ImagePathPipe,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);
  protected readonly imagePath = inject(ImagePathService);

  protected userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    firstname: [''],
    lastname: [''],
    email: ['', [Validators.required, Validators.email]],
    bio: [''],
    avatarFile: new FormControl<File | null>(null),
    public: [true],
  });
  protected removeAvatar: boolean = false;
  protected newAvatar?: string;
  protected usernameReq$ = this.api.getUsernameRequirements();
  protected user$?: Observable<User | null>;

  ngOnInit(): void {
    this.user$ = this.auth.user$.pipe(
      tap((user: User | null) => {
        if (user) {
          this.userForm.patchValue({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            bio: user.bio,
            public: user.public,
          });
        }
      }),
    );
  }

  selectImage(file: File | null) {
    if (file) {
      this.userForm.patchValue({
        avatarFile: file,
      });

      this.newAvatar = URL.createObjectURL(file);
      this.removeAvatar = false;
    } else {
      this.userForm.patchValue({
        avatarFile: null,
      });

      if (this.newAvatar) {
        URL.revokeObjectURL(this.newAvatar);
        this.newAvatar = undefined;
      }

      this.removeAvatar = true;
    }
  }

  // TODO: create userService for this
  submit(): void {
    const user: User = this.userForm.value;

    this.api
      .updateUser(user, { removeAvatar: this.removeAvatar })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const { msg, errorData } = err.error;

          switch (msg) {
            case 'USER_FIELD_EXISTS': {
              if (errorData.field === 'username' || errorData.field === 'email') {
                this.userForm.get(errorData.field)?.setErrors({ taken: true });
              }

              break;
            }
            case 'USER_FIELD_INVALID': {
              if (errorData.field === 'username' || errorData.field === 'email') {
                this.userForm.get(errorData.field)?.setErrors({ invalid: true });
              }

              break;
            }
            case 'IMG_NOT_VALID': {
              this.errorHandler.push(
                $localize`:@@errors.invalidImg:Invalid image.`,
              );
            }
          }

          return EMPTY;
        }),
      )
      .subscribe((user: User) => {
        this.auth.updateUser(user);
        this.router.navigate(['/']);
      });
  }
}
