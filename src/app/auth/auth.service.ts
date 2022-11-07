import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, throwError, BehaviorSubject } from 'rxjs';
import { User } from '../interfaces';
import { ApiService } from '../shared/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user?: User;

  constructor(private api: ApiService) {
    this.api.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.signedIn$.next(true)
      },
      error: () => { this.signedIn$.next(false) }
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.api.signIn(username, password).pipe(
      map((user: User) => {
        this.user = user;
        this.signedIn$.next(true);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.signedIn$.next(false);
        return throwError(() => HttpError.error);
      }),
    );
  }

  logOut(): Observable<any> {
    this.signedIn$.next(false);
  
    return this.api.logOut().pipe(catchError(() => of(null)));
  }

  isSignedIn(): boolean {
    const val = this.signedIn$.getValue();

    return val;
  }

  getUser(): User | undefined {
    return this.user;
  }
}
