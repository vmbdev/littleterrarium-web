import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@services/auth.service';

// FIXME: migrate to ReactForms
@Component({
  standalone: true,
  selector: 'lt-signin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  authInvalid: boolean = false;
  controls = {
    usernameEmpty: false,
    passwordEmpty: false,
  };

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((val: boolean) => {
      if (val) this.router.navigate(['/']);
    });
  }

  resetControls() {
    this.controls.usernameEmpty = false;
    this.controls.passwordEmpty = false;
    this.authInvalid = false;
  }

  submit(signinForm: any) {
    this.resetControls();

    if (!signinForm.valid) {
      if (!signinForm.value.username) this.controls.usernameEmpty = true;
      if (!signinForm.value.password) this.controls.passwordEmpty = true;
    } else {
      this.auth
        .signIn(signinForm.value.username, signinForm.value.password)
        .subscribe({
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
}
