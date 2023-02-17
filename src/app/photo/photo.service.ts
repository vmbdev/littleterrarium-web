import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Photo } from '../interfaces';
import { ApiService } from '../shared/api/api.service';

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

  get(id: number): Observable<any> {
    return this.api.getPhoto(id).pipe(
      map((photo: Photo) => {
        this.owned = (this.auth.user$.getValue()?.id === photo.ownerId);
        this.photo$.next(photo);

        return photo;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  create(photo: Photo): Observable<any> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push($localize `:@@errors.invalidImg:Invalid image.`);

        return EMPTY;
      })
    );
  }

  update(photo: Photo): Observable<any> {
    return this.api.updatePhoto(photo).pipe(
      map((updatedPhoto: Photo) => {
        this.photo$.next(updatedPhoto);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(): Observable<any> {
    const photo = this.photo$.getValue();

    if (photo) {
      const id = photo.id;

      return this.api.deletePhoto(id).pipe(
        map((data: any) => {
          this.photo$.next(null);
          return data;
        })
      );
    }
    else return of(null);
  }

}
