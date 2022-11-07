import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo/photo.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PhotoAddComponent } from './photo-add/photo-add.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { PictureBoxModule } from '../picture-box/picture-box.module';
import { WizardModule } from '../wizard/wizard.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { ToolboxModule } from '../toolbox/toolbox.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    PhotoComponent,
    PhotoAddComponent,
    PhotoListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    PictureBoxModule,
    WizardModule,
    FileUploaderModule,
    ToolboxModule,
    BreadcrumbModule
  ],
  exports: [
    PhotoComponent,
    PhotoAddComponent,
    PhotoListComponent
  ]
})
export class PhotoModule { }
