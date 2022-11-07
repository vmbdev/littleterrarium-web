import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickModalComponent } from './quick-modal/quick-modal.component';
import { CloseButtonComponent } from './close-button/close-button.component';
import { ModalTextComponent } from './modal-text/modal-text.component';



@NgModule({
  declarations: [
    QuickModalComponent,
    CloseButtonComponent,
    ModalTextComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    QuickModalComponent,
    ModalTextComponent
  ]
})
export class QuickModalModule { }
