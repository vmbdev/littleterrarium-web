import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, catchError, EMPTY, Observable } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { PasswordService } from '@services/password.service';

@Component({
  selector: 'lt-user-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardHeaderComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
  ],
  templateUrl: './user-password-recovery.component.html',
  styleUrl: './user-password-recovery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordRecoveryComponent {
  protected userForm: FormGroup = this.fb.group({
    userRef: ['', Validators.required],
  });
  protected checkError$ = new BehaviorSubject<boolean>(false);
  protected recoveryStarted$?: Observable<any>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pws: PasswordService,
  ) {}

  submit() {
    this.checkError$.next(false);
    this.recoveryStarted$ = undefined;

    if (!this.userForm.valid) return;

    const { userRef } = this.userForm.value;

    if (userRef) {
      this.recoveryStarted$ = this.pws.forgotPassword(userRef).pipe(
        catchError((err: HttpErrorResponse) => {
          this.checkError$.next(true);

          return EMPTY;
        }),
      );
    }
  }
}
