import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from './error-toast/error-toast.component';
import { CloseButtonModule } from '../close-button/close-button.module';



@NgModule({
  declarations: [
    ErrorToastComponent
  ],
  imports: [
    CommonModule,
    CloseButtonModule
  ],
  exports: [
    ErrorToastComponent
  ]
})
export class ErrorToastModule { }
