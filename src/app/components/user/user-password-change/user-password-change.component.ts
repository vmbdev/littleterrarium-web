import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  switchMap,
} from 'rxjs';

import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { PasswordFormComponent } from '@components/user/password-form/password-form.component';
import { PasswordService } from '@services/password.service';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

@Component({
  selector: 'lt-user-password-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    PasswordFormComponent,
  ],
  templateUrl: './user-password-change.component.html',
  styleUrl: './user-password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordChangeComponent {
  protected form: FormGroup = this.fb.group({
    password: [''],
    password2: [''],
  });
  protected pwdReq$ = this.pws.getPasswordRequirements();
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<User>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly pws: PasswordService,
  ) {}

  submit() {
    if (!this.form.valid) return;

    const pwd = this.form.get('password')?.value;

    this.errorInvalidPassword$.next(false);
    this.passwordChanged$ = this.auth.user$.pipe(
      switchMap((user: User | null) =>
        user ? this.pws.changePassword(pwd, user.id) : EMPTY,
      ),
      catchError((err) => {
        if (err.error?.msg === 'USER_PASSWD_INVALID') {
          this.errorInvalidPassword$.next(true);
        }

        return EMPTY;
      }),
    );
  }
}
