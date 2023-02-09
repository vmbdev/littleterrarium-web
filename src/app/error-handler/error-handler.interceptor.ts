import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string | undefined;

        if (error.status === 400) {
          switch (error.error.msg) {
            case 'IMG_NOT_VALID': {
              errorMsg = $localize `:@@errors.invalidImg:Invalid image.`;
              break;
            }
            case 'INCORRECT_FIELD': {
              errorMsg = $localize `:@@errors.field:Incorrect field (${error.error.data.field}:field:).`;
      
              if (error.error.data.values) {
                errorMsg += $localize `:@@errors.fieldValues:Possible values are ${error.error.data.values.join(',')}:values:`
              }
              break;
            }
            case 'MISSING_FIELD': {
              errorMsg = $localize `:@@errors.missingField:Missing field (${error.error.data.field}:field:)`;
              break;
            }
          }
        }
        else if (error.status === 500) errorMsg = $localize `:@@errors.server:Server error`;

        if (errorMsg) {
          this.errorHandler.push(errorMsg);
          return EMPTY;
        }
        else return throwError(() => error);

      })
    );
  }
}
