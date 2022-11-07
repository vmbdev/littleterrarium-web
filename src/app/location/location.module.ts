import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationListComponent } from './location-list/location-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PlantModule } from '../plant/plant.module';
import { LocationAddEditComponent } from './location-add-edit/location-add-edit.component';
import { LocationComponent } from './location/location.component';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { PictureBoxModule } from '../picture-box/picture-box.module';
import { WizardModule } from '../wizard/wizard.module';
import { ToolboxModule } from '../toolbox/toolbox.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { ConfirmModalModule } from '../confirm-modal/confirm-modal.module';

@NgModule({
  declarations: [
    LocationListComponent,
    LocationAddEditComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    PlantModule,
    FileUploaderModule,
    PictureBoxModule,
    WizardModule,
    ToolboxModule,
    BreadcrumbModule,
    ConfirmModalModule
  ],
  exports: [
    LocationListComponent,
    LocationAddEditComponent,
    LocationComponent
  ]
})
export class LocationModule { }
