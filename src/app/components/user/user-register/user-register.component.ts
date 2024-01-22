import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { PasswordFormComponent } from '@components/user/password-form/password-form.component';
import { AuthService } from '@services/auth.service';
import { ApiService } from '@services/api.service';
import { UserRegisterErrors, User } from '@models/user.model';
import { PasswordService } from '@services/password.service';

@Component({
  standalone: true,
  selector: 'lt-user-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    PasswordFormComponent,
  ],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
})
export class UserRegisterComponent {
  protected userForm: FormGroup;
  protected pwdForm: FormGroup;

  protected pwdReq$ = this.pws.getPasswordRequirements();
  protected usernameReq$ = this.api.getUsernameRequirements();

  protected wizardPage: number | undefined = undefined;
  protected errors: UserRegisterErrors = this.resetErrors();

  constructor(
    private readonly pws: PasswordService,
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly auth: AuthService,
  ) {
    this.pwdForm = this.fb.group({
      password: [''],
      password2: [''],
    });

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\S+@\S+\.\S+$/i),
        ]),
      ],
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  resetErrors(): UserRegisterErrors {
    return {
      usernameExists: false,
      usernameInvalid: false,
      emailExists: false,
      emailInvalid: false,
      pwd: {
        length: false,
        uppercase: false,
        numbers: false,
        nonAlphanumeric: false,
      },
    };
  }

  /**
   * Reset the wizard page so that we can move to it even if it's the same as
   * previously
   */
  indexChange(): void {
    this.wizardPage = undefined;
  }

  moveWizardPage(value: number | undefined): void {
    this.wizardPage = value;
  }

  submit(): void {
    if (!this.userForm.valid || !this.pwdForm.valid) return;

    this.errors = this.resetErrors();

    const pwd = this.pwdForm.get('password')?.value;

    this.pws
      .checkPassword(pwd)
      .pipe(
        switchMap(() => {
          const user: User = this.userForm.value;
          user.password = pwd;

          return this.auth.register(user);
        }),
        catchError((err: HttpErrorResponse) => {
          const error = err.error;

          if (error.msg === 'USER_FIELD_EXISTS') {
            if (error.errorData.field === 'username') {
              this.errors.usernameExists = true;
              this.moveWizardPage(0);
            } else if (error.errorData.field === 'email') {
              this.errors.emailExists = true;
              this.moveWizardPage(1);
            }
          } else if (error.msg === 'USER_FIELD_INVALID') {
            if (error.errorData.field === 'username') {
              this.errors.usernameInvalid = true;
              this.moveWizardPage(0);
            } else if (error.errorData.field === 'email') {
              this.errors.emailInvalid = true;
              this.moveWizardPage(1);
            }
          } else if (error.msg === 'USER_PASSWD_INVALID') {
            this.moveWizardPage(2);

            if (!error.errorData.comp.minLength) this.errors.pwd.length = true;
            if (!error.errorData.comp.hasUppercase) {
              this.errors.pwd.uppercase = true;
            }
            if (!error.errorData.comp.hasNumber) {
              this.errors.pwd.numbers = true;
            }
            if (!error.errorData.comp.hasNonAlphanumeric) {
              this.errors.pwd.nonAlphanumeric = true;
            }
          }

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }
}
