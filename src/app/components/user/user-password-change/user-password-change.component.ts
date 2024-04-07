import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  switchMap,
} from 'rxjs';

import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
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
    UserFormPasswordComponent,
  ],
  templateUrl: './user-password-change.component.html',
  styleUrl: './user-password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordChangeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly pws = inject(PasswordService);

  protected form: FormGroup = this.fb.group({
    password: [''],
  });
  protected pwdReq$ = this.pws.getPasswordRequirements();
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);
  protected passwordChanged$?: Observable<User>;

  submit() {
    if (!this.form.valid) return;

    const { password } = this.form.value;

    this.errorInvalidPassword$.next(false);
    this.passwordChanged$ = this.auth.user$.pipe(
      switchMap((user: User | null) =>
        user ? this.pws.changePassword(password, user.id) : EMPTY,
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
