import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  tap,
  throwError,
} from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { Photo } from '@models/photo.model';
import { BackendResponse } from '@models/backend-response.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photo = new BehaviorSubject<Photo | null>(null);
  public readonly photo$ = this.photo.asObservable();
  private owned = new BehaviorSubject<boolean>(false);
  public readonly owned$ = this.owned.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  get(id: number): Observable<Photo> {
    return this.api.getPhoto(id).pipe(
      catchError((err: HttpErrorResponse) => {
        this.photo.next(null);

        if (err.error?.msg === 'PHOTO_NOT_FOUND') {
          this.errorHandler.push($localize`:@@photo.invalid:Photo not found.`);
        }

        return throwError(() => err);
      }),
      tap((photo: Photo) => {
        this.owned.next(this.auth.getUser()?.id === photo.ownerId);
        this.photo.next(photo);
      }),
    );
  }

  getNavigation(id: number): Observable<any> {
    return this.api.getPhotoNavigation(id).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error?.msg === 'PHOTO_NOT_FOUND') {
          this.errorHandler.push($localize`:@@photo.invalid:Photo not found.`);
        }

        return throwError(() => err);
      }),
    );
  }

  create(
    photo: Photo,
    propagateError: boolean = false,
  ): Observable<HttpEvent<BackendResponse>> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push(
            $localize`:@@errors.invalidImg:Invalid image.`,
          );
        }

        if (propagateError) return throwError(() => error);
        else return EMPTY;
      }),
    );
  }

  update(photo: Photo): Observable<Photo> {
    return this.api.updatePhoto(photo).pipe(
      tap((updatedPhoto: Photo) => {
        this.photo.next(updatedPhoto);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo.next(null);

        return throwError(() => HttpError);
      }),
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.photo.getValue()?.id;

    if (id) return this.api.deletePhoto(id);
    else return EMPTY;
  }

  current(): Photo | null {
    return this.photo.getValue();
  }

  empty(): void {
    this.photo.next(null);
    this.owned.next(false);
  }
}
