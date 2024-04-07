import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { AuthService } from '@services/auth.service';
import { ApiService } from '@services/api.service';
import { PasswordService } from '@services/password.service';
import { User } from '@models/user.model';

@Component({
  standalone: true,
  selector: 'lt-user-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    WizardComponent,
    WizardPageComponent,
    UserFormUsernameComponent,
    UserFormEmailComponent,
    UserFormPasswordComponent,
  ],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly pws = inject(PasswordService);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  protected pwdReq$ = this.pws.getPasswordRequirements();
  protected usernameReq$ = this.api.getUsernameRequirements();
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);

  protected wizardPage$ = new BehaviorSubject<number | undefined>(0);
  protected userCreated$?: Observable<User>;

  /**
   * Reset the wizard page so that we can move to it even if it's the same as
   * previously
   */
  indexChange(): void {
    this.wizardPage$.next(undefined);
  }

  moveWizardPage(value: number | undefined): void {
    this.wizardPage$.next(value);
  }

  submit(): void {
    if (!this.form.valid) return;
    
    const { password } = this.form.value;

    this.form.get('username')?.setErrors(null);
    this.form.get('email')?.setErrors(null);
    this.form.get('password')?.setErrors(null);


    this.userCreated$ = this.pws.checkPassword(password).pipe(
      switchMap(() => {
        const user: User = this.form.value;

        return this.auth.register(user);
      }),
      tap(() => {
        this.router.navigateByUrl('/');
      }),
      catchError((err: HttpErrorResponse) => {
        const { msg, errorData } = err.error;

        switch (msg) {
          case 'USER_FIELD_EXISTS': {
            if (errorData.field === 'username') {
              this.form.get('username')?.setErrors({ taken: true });
              this.moveWizardPage(0);
            } else if (errorData.field === 'email') {
              this.form.get('email')?.setErrors({ taken: true });
              this.moveWizardPage(1);
            }

            break;
          }
          case 'USER_FIELD_INVALID': {
            if (errorData.field === 'username') {
              this.form.get('username')?.setErrors({ invalid: true });
              this.moveWizardPage(0);
            } else if (errorData.field === 'email') {
              this.form.get('email')?.setErrors({ invalid: true });
              this.moveWizardPage(1);
            }

            break;
          }
          case 'USER_PASSWD_INVALID': {
            this.moveWizardPage(2);
            this.errorInvalidPassword$.next(true);

            break;
          }
        }

        return EMPTY;
      }),
    );
  }
}
