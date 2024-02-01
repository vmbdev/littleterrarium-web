import { ErrorHandler, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private list = new BehaviorSubject<string | null>(null);
  public readonly list$ = this.list.asObservable();

  handleError(error: any) {}

  push(error: string) {
    this.list.next(error);
  }

  empty(): void {
    this.list.next(null);
  }
}
