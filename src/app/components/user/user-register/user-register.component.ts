import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { AuthService } from '@services/auth.service';
import { ApiService } from '@services/api.service';
import { PasswordRequirements, User, UsernameRequirements } from '@models/user.model';

type RegisterErrors = {
  usernameExists: boolean,
  usernameInvalid: boolean,
  emailExists: boolean,
  emailInvalid: boolean,
  pwd: {
    length: boolean,
    uppercase: boolean,
    numbers: boolean,
    nonAlphanumeric: boolean
  }
}

@Component({
  standalone: true,
  selector: 'lt-user-register',
  imports: [
    CommonModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent {
  userForm: FormGroup;
  pwdReq?: PasswordRequirements;
  usernameReq?: UsernameRequirements;
  wizardPage: number | undefined = undefined;
  nonAlphaNumChars: string = '!@#$%^&*()_+-=[]{};\':"\|,.\<>/?';
  errors: RegisterErrors = this.resetErrors();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\S+@\S+\.\S+$/i)
        ])
      ],
      passwordCheck: this.fb.group({
        password: ['', [
          Validators.required,
          this.checkPasswordStrength.bind(this)]
        ],
        password2: ['', Validators.required]
      }, { validators: this.checkPasswordsEqual }),
    });

    this.errors = this.resetErrors();
  }

  ngOnInit(): void {
    this.api.getPasswordRequirements()
    .subscribe((requirements: PasswordRequirements) => {
      this.pwdReq = requirements;
    });

    this.api.getUsernameRequirements()
    .subscribe((requirements: UsernameRequirements) => {
      this.usernameReq = requirements;
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  resetErrors(): RegisterErrors {
    return {
      usernameExists: false,
      usernameInvalid: false,
      emailExists: false,
      emailInvalid: false,
      pwd: {
        length: false,
        uppercase: false,
        numbers: false,
        nonAlphanumeric: false
      }
    }
  }

  checkPasswordsEqual(group: AbstractControl): ValidationErrors | null {
    const pwd1 = group.get('password')?.value;
    const pwd2 = group.get('password2')?.value;

    if (pwd1 !== pwd2) return { different: true };

    return null;
  }

  checkPasswordStrength(pwd: AbstractControl): ValidationErrors | null {
    const value = pwd.value;
    const errorObj: ValidationErrors = {};

    if (this.pwdReq) {
      if (value.length < this.pwdReq.minLength) errorObj['minLength'] = true;
      if (this.pwdReq.requireUppercase && !(/.*([A-Z]).*/).test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (this.pwdReq.requireNumber && !(/.*(\d).*/).test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        this.pwdReq.requireNonAlphanumeric
        && !(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/).test(value)
      ) {
        errorObj['missingNonAlphanumeric'] = true;
      }
    }

    return (Object.keys(errorObj).length > 0) ? errorObj : null;
  }

  hasPasswordConditions(): boolean {
    return !!(
      this.pwdReq
      && (
        this.pwdReq.requireNumber
        || this.pwdReq.requireUppercase
        || this.pwdReq.requireNonAlphanumeric
      )
    );
  }

  /**
   * Reset the wizard page so that we can move to it even if it's the same as previously
   */
  indexChange(): void {
    this.wizardPage = undefined;
  }

  moveWizardPage(value: number | undefined): void {
    this.wizardPage = value;
  }

  hasPasswordError(control: string): boolean | undefined {
    return this.userForm
      .get('passwordCheck')
      ?.get('password')
      ?.hasError(control);
  }

  submit(): void {
    if (!this.userForm.valid) return;

    this.errors = this.resetErrors();

    const pwd = this.userForm.get('passwordCheck')?.get('password')?.value;

    this.api.checkPassword(pwd).pipe(
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
          }
          else if (error.errorData.field === 'email') {
            this.errors.emailExists = true;
            this.moveWizardPage(1);
          }
        }

        else if (error.msg === 'USER_FIELD_INVALID') {
          if (error.errorData.field === 'username') {
            this.errors.usernameInvalid = true;
            this.moveWizardPage(0);
          }
          else if (error.errorData.field === 'email') {
            this.errors.emailInvalid = true;
            this.moveWizardPage(1);
          }
        }

        else if (error.msg === 'USER_PASSWD_INVALID') {
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
      })
    ).subscribe(() => {
      this.router.navigateByUrl('/')
    });
  }
}