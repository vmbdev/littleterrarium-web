import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, skipWhile, switchMap } from 'rxjs';

import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { CurrentPicComponent } from '@components/current-pic/current-pic.component';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
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
    FileUploaderComponent,
    CurrentPicComponent,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent {
  protected userForm: FormGroup;
  protected removeAvatar: boolean = false;
  protected currentAvatar?: string | null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly api: ApiService,
    public readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService,
    public readonly imagePath: ImagePathService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: [''],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      avatarFile: [''],
      public: [''],
    });
  }

  ngOnInit(): void {
    this.auth.checked$
      .pipe(
        skipWhile((val) => val === false),
        switchMap(() => this.auth.user$)
      )
      .subscribe((user: User | null) => {
        if (user) {
          if (user.avatar) {
            this.currentAvatar = this.imagePath.get(user.avatar, 'thumb');
          }

          this.userForm.patchValue({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            bio: user.bio,
            public: user.public,
          });
        }
      });
  }

  fileChange(files: File[]) {
    this.userForm.patchValue({
      avatarFile: files[0],
    });
  }

  toggleRemoveAvatar(val: boolean) {
    this.removeAvatar = val;
  }

  // TODO: detect errors in editing
  // TODO: merge a class for this and register
  submit(): void {
    const user: User = this.userForm.value;

    this.api
      .editUser(user, { removeAvatar: this.removeAvatar })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const error = err.error;

          if (error.msg === 'USER_FIELD_EXISTS') {
            if (error.errorData.field === 'username') {
            }
          }
          if (error.msg === 'IMG_NOT_VALID') {
            this.errorHandler.push(
              $localize`:@@errors.invalidImg:Invalid image.`
            );
          }

          return EMPTY;
        })
      )
      .subscribe((user: User) => {
        this.auth.updateUser(user);
        this.router.navigate(['/']);
      });
  }
}
