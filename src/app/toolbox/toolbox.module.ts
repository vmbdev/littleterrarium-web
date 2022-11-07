import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { ButtonComponent } from './button/button.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ToolboxComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ToolboxComponent,
    ButtonComponent
  ]
})
export class ToolboxModule { }
