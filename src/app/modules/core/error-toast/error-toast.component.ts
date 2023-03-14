import { Component } from '@angular/core';
import { ErrorHandlerService } from '@services/error-handler.service';

@Component({
  selector: 'error-toast',
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
