import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from './breadcrumb.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    BreadcrumbService,
    RouterModule
  ]
})
export class BreadcrumbModule { }
