import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'lt-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  @Output() accept: EventEmitter<null> = new EventEmitter<null>();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();

  constructor(private readonly elementRef: ElementRef) {}

  onAccept(): void {
    this.elementRef.nativeElement.remove();
    this.accept.emit();
  }

  onCancel(): void {
    this.elementRef.nativeElement.remove();
    this.cancel.emit();
  }
}
