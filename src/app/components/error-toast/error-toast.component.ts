import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CloseButtonComponent } from '@components/close-button/close-button.component';
import { ErrorHandlerService } from '@services/error-handler.service';

@Component({
  selector: 'lt-error-toast',
  standalone: true,
  imports: [CommonModule, CloseButtonComponent],
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {
  constructor(protected readonly errorHandler: ErrorHandlerService) {}

  removeError(index: number): void {
    this.errorHandler.remove(index);
  }
}
