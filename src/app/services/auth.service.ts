import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  catchError,
  throwError,
  BehaviorSubject,
  tap,
} from 'rxjs';

import { ApiService, UserPreferences } from '@services/api.service';
import { User } from '@models/user.model';

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

  constructor(private readonly api: ApiService) {
    this.api.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user.next(user);
        this.signedIn.next(true);
        this.checked.next(true);
      },
      error: () => {
        this.checked.next(true);
      },
    });
  }

  signIn(username: string, password: string): Observable<User> {
    return this.api.signIn(username, password).pipe(
      tap((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.signedIn.next(false);
        return throwError(() => HttpError.error);
      }),
    );
  }

  register(user: User): Observable<User> {
    return this.api.createUser(user).pipe(
      tap((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);
      }),
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

  isSameUser(param: 'username' | 'id', val: string | number): boolean {
    const user = this.user.getValue();

    return !!(user && user[param] === val);
  }

  getPref(key: string): any {
    const user = this.user.getValue();

    if (user?.preferences[key]) return user.preferences[key];
    else return null;
  }

  setPref(prefs: UserPreferences): Observable<User | null> {
    const user = this.user.getValue();

    if (user) {
      const newPrefs = {
        ...user.preferences,
        ...prefs,
      };

      return this.api.updatePreferences(newPrefs).pipe(
        tap((user: User) => {
          this.user.next(user);
        }),
      );
    } else return of(null);
  }

}
