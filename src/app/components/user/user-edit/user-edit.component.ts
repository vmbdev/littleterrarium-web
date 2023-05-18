import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, skipWhile } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { WizardModule } from '@modules/wizard/wizard.module';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { User } from '@models/user.model';

@Component({
  standalone: true,
  selector: 'user-edit',
  imports: [
    CommonModule,
    WizardModule,
    ReactiveFormsModule,
    RouterModule,
    FileUploaderComponent
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService
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
      skipWhile(val => val === false)
    ).subscribe(() => {
      const user = this.auth.getUser();

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
    });
  }

  fileChange(files: File[]) {
    this.userForm.patchValue({
      avatarFile: files[0]
    });
  }

  // TODO: detect if username or email are already taken
  submit(): void {
    const user: User = this.userForm.value;

    this.api.editUser(user).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push($localize `:@@errors.invalidImg:Invalid image.`);

        return EMPTY;
      })
    ).subscribe((user: User) => {
      this.auth.updateUser(user);
      this.router.navigate(['/']);
    });
  }

}
