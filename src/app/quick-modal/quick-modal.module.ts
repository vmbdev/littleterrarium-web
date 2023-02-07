import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickModalComponent } from './quick-modal/quick-modal.component';
import { ModalTextComponent } from './modal-text/modal-text.component';
import { CloseButtonModule } from '../close-button/close-button.module';



@NgModule({
  declarations: [
    QuickModalComponent,
    ModalTextComponent
  ],
  imports: [
    CommonModule,
    CloseButtonModule
  ],
  exports: [
    QuickModalComponent,
    ModalTextComponent
  ]
})
export class QuickModalModule { }
