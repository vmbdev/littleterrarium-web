import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { catchError, EMPTY, skipWhile } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';

@Component({
  standalone: true,
  selector: 'lt-user-edit',
  imports: [
    CommonModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    ReactiveFormsModule,
    RouterModule,
    FileUploaderComponent
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
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
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push(
            $localize `:@@errors.invalidImg:Invalid image.`
          );
        }

        return EMPTY;
      })
    ).subscribe((user: User) => {
      this.auth.updateUser(user);
      this.router.navigate(['/']);
    });
  }

}
