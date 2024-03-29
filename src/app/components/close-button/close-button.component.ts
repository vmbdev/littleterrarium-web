import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Component that provides a closing button for other components such
 * as a modal window.
 */
@Component({
  standalone: true,
  selector: 'lt-close-button',
  imports: [CommonModule],
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseButtonComponent {
  /**
   * The button will be rendered as a smaller version.
   */
  @Input({ transform: booleanAttribute }) small: boolean = false;

  /**
   * Color of the button background and border.
   */
  @Input() color?: string;

  /**
   * The button has been activated.
   */
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits the close event.
   */
  closeEvent(): void {
    this.close.emit();
  }
}
