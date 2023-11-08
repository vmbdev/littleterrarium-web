import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CloseButtonComponent
} from '@components/close-button/close-button.component';

@Component({
  standalone: true,
  selector: 'lt-quick-modal',
  imports: [CloseButtonComponent],
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss']
})
export class QuickModalComponent {
  @Input() title: string = '';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  propagateClose(): void {
    this.close.emit();
  }

}
