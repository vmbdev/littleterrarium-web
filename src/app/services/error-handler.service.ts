import { ErrorHandler, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private list = new BehaviorSubject<string[]>([]);
  public readonly list$ = this.list.asObservable();

  handleError(_error: any) {}

  push(error: string) {
    const current = this.list.getValue();

    if (current) {
      current.unshift(error);
      this.list.next(current);
    }
  }

  remove(index: number) {
    const current = this.list.getValue();

    if (current) {
      current.splice(index, 1)
      this.list.next(current);
    }
  }

  empty(): void {
    this.list.next([]);
  }
}
