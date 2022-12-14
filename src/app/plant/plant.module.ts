import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PhotoModule } from '../photo/photo.module';
import { PictureBoxModule } from '../picture-box/picture-box.module';
import { WizardModule } from '../wizard/wizard.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { SpecieFinderModule } from '../specie-finder/specie-finder.module';
import { ToolboxModule } from '../toolbox/toolbox.module';
import { QuickModalModule } from '../quick-modal/quick-modal.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { PlusButtonModule } from '../plus-button/plus-button.module';
import { ConfirmModalModule } from '../confirm-modal/confirm-modal.module';
import { WidgetBoxModule } from '../widget-box/widget-box.module';

import { PlantComponent } from './plant/plant.component';
import { PlantAddComponent } from './plant-add/plant-add.component';
import { PlantListComponent } from './plant-list/plant-list.component';
import { PlantEditWateringComponent } from './plant-edit-watering/plant-edit-watering.component';
import { PlantEditFertilizerComponent } from './plant-edit-fertilizer/plant-edit-fertilizer.component';
import { PlantEditSoilComponent } from './plant-edit-soil/plant-edit-soil.component';
import { PlantAllComponent } from './plant-all/plant-all.component';

import { PlantService } from './plant.service';
import { PlantWidgetWaterComponent } from './plant-widget-water/plant-widget-water.component';
import { PlantWidgetFertilizerComponent } from './plant-widget-fertilizer/plant-widget-fertilizer.component';
import { PlantWidgetSoilComponent } from './plant-widget-soil/plant-widget-soil.component';
import { PlantEditComponent } from './plant-edit/plant-edit.component';
import { InfoBoxModule } from '../info-box/info-box.module';

@NgModule({
  declarations: [
    PlantListComponent,
    PlantComponent,
    PlantAddComponent,
    PlantEditWateringComponent,
    PlantEditFertilizerComponent,
    PlantEditSoilComponent,
    PlantAllComponent,
    PlantWidgetWaterComponent,
    PlantWidgetFertilizerComponent,
    PlantWidgetSoilComponent,
    PlantEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    PhotoModule,
    PictureBoxModule,
    WizardModule,
    FileUploaderModule,
    SpecieFinderModule,
    ToolboxModule,
    QuickModalModule,
    BreadcrumbModule,
    PlusButtonModule,
    ConfirmModalModule,
    WidgetBoxModule,
    InfoBoxModule
  ],
  exports: [
    PlantListComponent,
    PlantAddComponent,
    PlantAllComponent,
    PlantEditComponent
  ],
  providers: [
    PlantService
  ]
})
export class PlantModule { }
