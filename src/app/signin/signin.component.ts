import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  @Input() homepage?: boolean;
  authInvalid: boolean = false;
  controls = {
    usernameEmpty: false,
    passwordEmpty: false,
  }

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((val: boolean) => {
      if (val) this.router.navigate(['/']);
    })
  }

  resetControls() {
    this.controls.usernameEmpty = false;
    this.controls.passwordEmpty = false;
    this.authInvalid = false;
  }

  onSubmit(signinForm: any) {
    this.resetControls();

    if (!signinForm.valid) {
      if (!signinForm.value.username) this.controls.usernameEmpty = true;
      if (!signinForm.value.password) this.controls.passwordEmpty = true;
    }

    else {
      this.auth.signIn(signinForm.value.username, signinForm.value.password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          if (err.msg && (err.msg === 'USER_DATA_INCORRECT')) this.authInvalid = true;
        }
      });
    }
  }
}
