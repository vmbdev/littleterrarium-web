import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CloseButtonComponent } from '@components/close-button/close-button.component';
import { ErrorHandlerService } from '@services/error-handler.service';

@Component({
  standalone: true,
  selector: 'error-toast',
  imports: [CommonModule, CloseButtonComponent],
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.scss']
})
export class ErrorToastComponent {
  errorList: string[] = [];

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.errorHandler.list$.subscribe((error: string | null) => {
      if (error) this.errorList.unshift(error);
    })
  }

  removeError(index: number): void {
    this.errorList.splice(index, 1);
  }
}
