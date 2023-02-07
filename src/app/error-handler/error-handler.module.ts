import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from './error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ErrorHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass:ErrorHandlerInterceptor, multi: true }
  ]
})
export class ErrorHandlerModule { }
