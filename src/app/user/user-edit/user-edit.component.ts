import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, skipWhile } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { User } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: [''],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      avatar: [''],
      public: [''],
    })
  }

  ngOnInit(): void {
    this.auth.checked$.pipe(
      skipWhile(val => val === false),
      map(() => {
        if (this.auth.signedIn$.getValue()) {
          const user = this.auth.getUser();

          if (user) {
            this.userForm.patchValue({
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              bio: user.bio,
              avatar: user.avatar,
              public: user.public
            });
          }
        }
      })
    ).subscribe();
  }

  submit(): void {

  }

}
