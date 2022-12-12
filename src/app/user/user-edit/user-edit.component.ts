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
      avatarFile: [''],
      public: [''],
    })
  }

  ngOnInit(): void {
    this.auth.checked$.pipe(
      skipWhile(val => val === false),
      map(() => {
        const user = this.auth.user$.getValue();

        if (user) {
          this.userForm.patchValue({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            bio: user.bio,
            public: user.public
          });
        }
      })
    ).subscribe();
  }

  fileChange(files: File[]) {
    this.userForm.patchValue({
      avatarFile: files[0]
    });
  }

  submit(): void {
    const user: User = this.userForm.value;

    this.api.editUser(user).subscribe({
      next: (updatedUser: User) => {
        this.auth.updateUser(updatedUser);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
