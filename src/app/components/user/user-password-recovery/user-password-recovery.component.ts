import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { catchError, EMPTY } from 'rxjs';

import {
  WizardComponent
} from '@components/wizard/wizard/wizard.component';
import {
  WizardHeaderComponent
} from '@components/wizard/wizard-header/wizard-header.component';
import {
  WizardPageComponent
} from '@components/wizard/wizard-page/wizard-page.component';
import {
  WizardPageDescriptionComponent
} from '@components/wizard/wizard-page-description/wizard-page-description.component';
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
})
export class UserPasswordRecoveryComponent {
  userForm: FormGroup;
  checkError: boolean = false;
  recoveryStarted: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pws: PasswordService
  ) {
    this.userForm = this.fb.group({
      userRef: ['', Validators.required],
    });
  }

  submit() {
    this.checkError = false;
    this.recoveryStarted = false;

    if (!this.userForm.valid) return;

    const { userRef } = this.userForm.value;

    if (userRef) {
      this.pws
        .forgotPassword(userRef)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.checkError = true;

            return EMPTY;
          })
        )
        .subscribe(() => {
          this.recoveryStarted = true;
        });
    }
  }
}
