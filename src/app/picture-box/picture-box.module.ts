import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureBoxComponent } from './picture-box.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PictureBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PictureBoxComponent
  ]
})
export class PictureBoxModule { }
