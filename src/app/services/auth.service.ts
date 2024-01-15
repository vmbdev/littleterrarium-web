import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  map,
  catchError,
  throwError,
  BehaviorSubject,
} from 'rxjs';

import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';
import { BackendResponse } from '@models/backend-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // signedIn$ exists just for convenience.
  // We can achieve the same checking if user$ is null
  private signedIn = new BehaviorSubject<boolean>(false);
  public readonly signedIn$ = this.signedIn.asObservable();

  private checked = new BehaviorSubject<boolean>(false);
  public readonly checked$ = this.checked.asObservable();

  private user = new BehaviorSubject<User | null>(null);
  public readonly user$ = this.user.asObservable();

  constructor(private api: ApiService) {
    this.api.getCurrentUser().subscribe({
      next: (user: User) => {
        this.signedIn.next(true);
        this.user.next(user);
        this.checked.next(true);
      },
      error: () => {
        this.checked.next(true);
      },
    });
  }

  signIn(username: string, password: string): Observable<User> {
    return this.api.signIn(username, password).pipe(
      map((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);

        return user;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.signedIn.next(false);
        return throwError(() => HttpError.error);
      })
    );
  }

  register(user: User): Observable<User> {
    return this.api.createUser(user).pipe(
      map((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);

        return user;
      })
    );
  }

  logOut(): Observable<any> {
    this.signedIn.next(false);
    this.user.next(null);

    return this.api.logOut().pipe(catchError(() => of(null)));
  }

  getUser(): User | null {
    return this.user.getValue();
  }

  updateUser(user: User): void {
    this.user.next(user);
  }

  forgotPassword(userRef: string): Observable<any> {
    return this.api.forgotPassword(userRef);
  }

  recoverPassword(
    token: string,
    password: string,
    userId: number
  ): Observable<any> {
    return this.api.recoverPassword(token, password, userId);
  }

  checkPassword(password: string): Observable<BackendResponse> {
    return this.api.checkPassword(password);
  }

  isSameUser(param: 'username' | 'id', val: string | number): boolean {
    const user = this.user.getValue();

    return !!(user && user[param] === val);
  }
}
