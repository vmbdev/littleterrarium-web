import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { ErrorToastModule } from '../error-toast/error-toast.module';


@NgModule({
  declarations: [
    DefaultLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    ErrorToastModule
  ],
  exports: [
    DefaultLayoutComponent
  ]
})
export class LayoutModule { }
