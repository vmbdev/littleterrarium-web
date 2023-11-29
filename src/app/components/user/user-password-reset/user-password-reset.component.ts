import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { catchError, EMPTY } from 'rxjs';

import {
  WizardHeaderComponent
} from '@components/wizard/wizard-header/wizard-header.component';
import {
  WizardPageDescriptionComponent
} from '@components/wizard/wizard-page-description/wizard-page-description.component';
import {
  WizardPageComponent
} from '@components/wizard/wizard-page/wizard-page.component';
import {
  WizardComponent
} from '@components/wizard/wizard/wizard.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lt-user-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardHeaderComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent
  ],
  templateUrl: './user-password-reset.component.html',
  styleUrl: './user-password-reset.component.scss'
})
export class UserPasswordResetComponent {
  userForm: FormGroup;
  token?: string | null;
  userId?: number | null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.userForm = this.fb.group({
      userRef: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    // console.log(this.token, this.userId);
  }

  submit() {

    if (!this.userForm.valid) return;

  }
}
