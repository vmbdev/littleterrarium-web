import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegisterComponent } from './user-register/user-register.component';
import { WizardModule } from '../wizard/wizard.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserLogoutComponent } from './user-logout/user-logout.component';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';

@NgModule({
  declarations: [
    UserRegisterComponent,
    UserEditComponent,
    UserLogoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WizardModule,
    ReactiveFormsModule,
    RouterModule,
    FileUploaderModule
  ],
  exports: [
    UserRegisterComponent,
    UserEditComponent,
    UserLogoutComponent
  ]
})
export class UserModule { }
