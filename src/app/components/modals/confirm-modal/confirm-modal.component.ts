import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lt-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  @Output() accept: EventEmitter<null> = new EventEmitter<null>();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();

  constructor(private elementRef: ElementRef) {}

  onAccept(): void {
    this.elementRef.nativeElement.remove();
    this.accept.emit();
  }

  onCancel(): void {
    this.elementRef.nativeElement.remove();
    this.cancel.emit();
  }
}
