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
import { ConfirmModalModule } from '../confirm-modal/confirm-modal.module';
import { QuickModalModule } from '../quick-modal/quick-modal.module';
import { PhotoEditComponent } from './photo-edit/photo-edit.component';
import { InfoBoxModule } from '../info-box/info-box.module';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';


@NgModule({
  declarations: [
    PhotoComponent,
    PhotoAddComponent,
    PhotoListComponent,
    PhotoEditComponent
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
    BreadcrumbModule,
    ConfirmModalModule,
    QuickModalModule,
    InfoBoxModule,
    ProgressBarModule
  ],
  exports: [
    PhotoComponent,
    PhotoAddComponent,
    PhotoListComponent
  ]
})
export class PhotoModule { }
