import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegisterComponent } from './user-register/user-register.component';
import { WizardModule } from '../wizard/wizard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserLogoutComponent } from './user-logout/user-logout.component';

@NgModule({
  declarations: [
    UserRegisterComponent,
    UserEditComponent,
    UserSigninComponent,
    UserLogoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WizardModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    UserRegisterComponent,
    UserEditComponent,
    UserSigninComponent,
    UserLogoutComponent
  ]
})
export class UserModule { }
