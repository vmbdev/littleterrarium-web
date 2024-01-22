import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { PasswordFormComponent } from '@components/user/password-form/password-form.component';
import { PasswordService } from '@services/password.service';

@Component({
  selector: 'lt-user-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    PasswordFormComponent,
  ],
  templateUrl: './user-password-reset.component.html',
  styleUrl: './user-password-reset.component.scss',
})
export class UserPasswordResetComponent {
  protected form: FormGroup;
  protected pwdReq$ = this.pws.getPasswordRequirements();
  private token?: string | null;
  private userId?: number | null;

  protected errorInvalidToken: boolean = false;
  protected errorInvalidPassword: boolean = false;
  protected passwordChanged: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly pws: PasswordService,
  ) {
    this.form = this.fb.group({
      password: [''],
      password2: [''],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    if (this.token && this.userId) {
      this.pws
        .verifyToken(this.token, this.userId)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorInvalidToken = true;

            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  submit() {
    if (!this.form.valid || !(this.token && this.userId)) {
      return;
    }

    const pwd = this.form.get('password')?.value;
    this.pws
      .recoverPassword(this.token, pwd, this.userId)
      .pipe(
        catchError((err) => {
          const msg = err.error?.msg;

          if (msg === 'USER_TOKEN_EXPIRED' || msg === 'USER_TOKEN_INVALID') {
            this.errorInvalidToken = true;
          } else if (msg === 'USER_PASSWD_INVALID') {
            this.errorInvalidPassword = true;
          }

          return EMPTY;
        }),
      )
      .subscribe((res) => {
        this.passwordChanged = true;
      });
  }
}
