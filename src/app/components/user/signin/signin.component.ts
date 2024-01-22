import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Component({
  standalone: true,
  selector: 'lt-signin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  protected form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected authInvalid: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    public readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit() {
    const signinForm = this.form.value;
    this.authInvalid = false;

    this.auth.signIn(signinForm.username, signinForm.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        if (err.msg && err.msg === 'USER_DATA_INCORRECT') {
          this.authInvalid = true;
        }
      },
    });
  }
}
