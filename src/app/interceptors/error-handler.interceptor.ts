import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

import { ErrorHandlerService } from '@services/error-handler.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private readonly errorHandler: ErrorHandlerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        let errorMsg: string | undefined;

        if (res.status === 400) {
          const errorData = res.error.errorData;

          switch (res.error.msg) {
            case 'INCORRECT_FIELD': {
              errorMsg = $localize`:@@errors.field:Incorrect field (${errorData.field}:field:).`;

              if (errorData.values) {
                errorMsg += $localize`:@@errors.fieldValues:Possible values are ${errorData.values.join(
                  ','
                )}:values:`;
              }
              break;
            }
            case 'MISSING_FIELD': {
              errorMsg = $localize`:@@errors.missingField:Missing field (${errorData.field}:field:)`;
              break;
            }
          }
        } else if (res.status === 500) {
          errorMsg = $localize`:@@errors.server:Server error`;
        }

        if (errorMsg) {
          this.errorHandler.push(errorMsg);

          return EMPTY;
        } else return throwError(() => res);
      })
    );
  }
}
