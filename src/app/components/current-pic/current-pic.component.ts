import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CloseButtonComponent } from '@components/close-button/close-button.component';

@Component({
  selector: 'lt-current-pic',
  standalone: true,
  imports: [CloseButtonComponent],
  templateUrl: './current-pic.component.html',
  styleUrl: './current-pic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPicComponent {
  @Input({ required: true }) pic: string | null = null;
  @Output() remove = new EventEmitter<boolean>(false);

  removePic(): void {
    this.remove.emit(true);
  }
}
