import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  userForm: FormGroup;
  pwdReq?: any = null;
  wizardPage: number | undefined = undefined;
  errors: any = {};

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/i)])],
      passwordCheck: this.fb.group({
        password: ['', [Validators.required, this.checkPasswordStrength.bind(this)]],
        password2: ['', Validators.required]
      }, { validators: this.checkPasswordsEqual }),
    });

    this.resetErrors();
  }

  ngOnInit(): void {
    this.api.getPasswordRequirements().subscribe((data: any) => {
      this.pwdReq = data;
    });
  }

  resetErrors(): void {
    this.errors = {
      username: false,
      email: false,
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
      if (this.pwdReq.requireUppercase && !(/.*([A-Z]).*/).test(value)) errorObj['missingUppercase'] = true;
      if (this.pwdReq.requireNumber && !(/.*(\d).*/).test(value)) errorObj['missingNumber'] = true;
      if (this.pwdReq.requireNonAlphanumeric && !(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/).test(value)) {
        errorObj['missingNonAlphanumeric'] = true;
      }
    }

    return (Object.keys(errorObj).length > 0) ? errorObj : null;
  }

  havePasswordConditions(): boolean {
    return !!(this.pwdReq && (this.pwdReq.requireNumber || this.pwdReq.requireUppercase || this.pwdReq.requireNonAlphanumeric));
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

  submit(): void {
    if (!this.userForm.valid) return;

    this.resetErrors();

    const pwd = this.userForm.get('passwordCheck')?.get('password')?.value;

    this.api.checkPassword(pwd).pipe(
      switchMap(() => {
        const user: User = this.userForm.value;
        user.password = pwd;

        return this.api.createUser(user);
      }),
      catchError((err: HttpErrorResponse) => {
        const error = err.error;

        if (error.msg === 'USER_FIELD') {
          if (error.data.field === 'username') {
            this.errors.username = true;
            this.moveWizardPage(0);
          }
          else if (error.data.field === 'email') {
            this.errors.email = true;
            this.moveWizardPage(1);
          }
        }

        else if (error.msg === 'USER_PASSWD_INVALID') {
          this.moveWizardPage(2);

          if (!error.data.comp.minLength) this.errors.pwd.length = true;
          if (!error.data.comp.hasUppercase) this.errors.pwd.uppercase = true;
          if (!error.data.comp.hasNumber) this.errors.pwd.numbers = true;
          if (!error.data.comp.hasNonAlphanumeric) this.errors.pwd.nonAlphanumeric = true;
        }

        return of(false);
      })
    )
    .subscribe((data: any) => {
      if (data) this.router.navigate(['/']);
    });
  }
}