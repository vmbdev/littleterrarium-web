import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { ButtonComponent } from './button/button.component';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';



@NgModule({
  declarations: [
    ToolboxComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    CapitalizePipe
  ],
  exports: [
    ToolboxComponent,
    ButtonComponent
  ]
})
export class ToolboxModule { }
