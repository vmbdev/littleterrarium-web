import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  throwError
} from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService, PhotoGetConfig } from '@services/api.service';
import { Photo } from '@models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photo$: BehaviorSubject<Photo | null> = new BehaviorSubject<Photo | null>(null);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  get(id: number, options?: PhotoGetConfig): Observable<Photo> {
    return this.api.getPhoto(id, options).pipe(
      map((photo: Photo) => {
        this.owned = (this.auth.getUser()?.id === photo.ownerId);
        this.photo$.next(photo);

        return photo;
      }),
      catchError((error: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => error);
      })
    );
  }

  getNavigation(id: number): Observable<any> {
    return this.api.getPhotoNavigation(id);
  }

  create(photo: Photo, propagateError: boolean = false): Observable<any> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push($localize `:@@errors.invalidImg:Invalid image.`);
        }

        if (propagateError) return throwError(() => error);
        else return EMPTY;
      })
    );
  }

  update(photo: Photo): Observable<Photo> {
    return this.api.updatePhoto(photo).pipe(
      map((updatedPhoto: Photo) => {
        this.photo$.next(updatedPhoto);

        return photo;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.photo$.getValue()?.id;
    
    if (id) return this.api.deletePhoto(id);
    else return EMPTY;
  }

}
