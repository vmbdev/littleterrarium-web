import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  CloseButtonComponent
} from '@components/close-button/close-button.component';

@Component({
  standalone: true,
  selector: 'lt-quick-modal',
  imports: [CloseButtonComponent],
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss'],
})
export class QuickModalComponent {
  @Input() title: string = '';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {}

  onClose(): void {
    this.elementRef.nativeElement.remove();
    this.close.emit();
  }
}
