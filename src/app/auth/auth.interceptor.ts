import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    });

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 403) {
          // TODO: to error manager
          return throwError(() => new Error('Forbidden'))
        }

        return throwError(() => err);
      })
    );
  }
}
