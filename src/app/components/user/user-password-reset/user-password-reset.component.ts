import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, catchError, EMPTY, Observable } from 'rxjs';

import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { UserFormPasswordComponent } from '@components/user/forms/user-form-password/user-form-password.component';
import { PasswordService } from '@services/password.service';

@Component({
  selector: 'lt-user-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    UserFormPasswordComponent,
  ],
  templateUrl: './user-password-reset.component.html',
  styleUrl: './user-password-reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordResetComponent {
  protected form: FormGroup = this.fb.group({
    password: [''],
  });
  protected token?: string | null;
  protected userId?: number | null;
  
  protected pwdReq$ = this.pws.getPasswordRequirements();
  protected tokenValid$?: Observable<any>;
  protected passwordChanged$?: Observable<any>;
  protected errorInvalidPassword$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly pws: PasswordService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.tokenValid$ = this.pws.verifyToken(this.token, this.userId);
    }
  }

  submit() {
    if (!this.form.valid || !(this.token && this.userId)) return;

    const { password } = this.form.value;

    this.errorInvalidPassword$.next(false);
    this.passwordChanged$ = this.pws
      .recoverPassword(this.token, password, this.userId)
      .pipe(
        catchError((err) => {
          const msg = err.error?.msg;

          if (msg === 'USER_TOKEN_EXPIRED' || msg === 'USER_TOKEN_INVALID') {
            this.tokenValid$ = undefined;
          } else if (msg === 'USER_PASSWD_INVALID') {
            this.errorInvalidPassword$.next(true);
          }

          return EMPTY;
        }),
      );
  }
}
