import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './wizard/wizard.component';
import { PageComponent } from './page/page.component';
import { PageDescriptionComponent } from './page-description/page-description.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WizardHeaderComponent } from './wizard-header/wizard-header.component';



@NgModule({
  declarations: [
    WizardComponent,
    PageComponent,
    PageDescriptionComponent,
    WizardHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    WizardComponent,
    PageComponent,
    PageDescriptionComponent,
    WizardHeaderComponent
  ]
})
export class WizardModule { }
