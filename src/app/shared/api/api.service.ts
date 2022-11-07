import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { User, Location, Plant, Photo, Specie } from 'src/app/interfaces';
import { endpoint } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions: any = {};

  constructor(private http: HttpClient) {
    this.httpOptions.withCredentials = true;
  }

  endpoint = (path: string) => {
    return `${endpoint}/${path}`;
  }

  /**
   * Auth and user API functions
   */

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.endpoint('user'))
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.endpoint('user/signin'), { username, password });
  }

  logOut(): Observable<any> {
    return this.http.get<any>(this.endpoint('user/logout'));
  }

  getPasswordRequirements(): Observable<any> {
    return this.http.get<any>(this.endpoint('user/password/requirements'));
  }

  checkPassword(password: string): Observable<any> {
    return this.http.post<any>(this.endpoint('user/password/check'), { password });
  }

  createUser(user: User): Observable<any> {
    return this.http.post<User>(this.endpoint('user'), user);
  }

  /**
   * Location related calls
   */

  getLocation(id: number, plants?: boolean, limit?: number): Observable<Location> {
    const url = `location/${id}?plants=${plants ? 'true' : 'false'}&limit=${limit ? limit : 0}`;

    return this.http.get<Location>(this.endpoint(url)).pipe(
      map(data => data),
      catchError((HttpError: HttpErrorResponse) => {
        if (HttpError.error.msg) return throwError(() => { return { msg: HttpError.error.msg, code: HttpError.status } })
        else return throwError(() => undefined);
      })
    );
  }

  // retrieve location list for current user
  getLocationList(options?: any): Observable<Location[]> {
    let url = 'location';

    if (options) {
      if (options.plantCount) url += `?plantcount=true`;
      else url += `?plants=${(options.plants ? 'true' : 'false')}&limit=${(options.limit ? options.limit : 3)}`;
    }

    return this.http.get<Location[]>(this.endpoint(url));
  }

  /**
   * Creates a new Location or updates an existing one.
   * @param location The location to be upserted
   * @param update Whether we're creating (false/null) or updating (true) an existing one.
   * @returns An observable with the server response.
   */
  upsertLocation(location: Location, update?: boolean): Observable<any> {
    let observable;
    const form = new FormData();

    form.append('name', location.name);
    form.append('light', location.light);
    form.append('public', location.public.toString());
    if (location.pictureFile) form.append('picture', location.pictureFile);
    if (location.id && update) form.append('id', location.id.toString());

    if (update) observable = this.http.put<Location>(this.endpoint('location'), form);
    else observable = this.http.post<Location>(this.endpoint('location'), form);

    return observable.pipe(
      map((data: any) => {
        if ((data.msg === 'LOCATION_CREATED') || (data.msg === 'LOCATION_UPDATED')) {
          return data;
        }
        else return throwError(() => 'Server error');
      }),
      catchError(err => {
        return throwError(() => (
          {
            msg: err.error.msg,
            data: err.error.data ? err.error.data : undefined,
            code: err.status.code ? err.status.code : undefined
          }
        ));
      })
    )
  }

  createLocation(location: Location): Observable<Location> {
    return this.upsertLocation(location);
  }

  updateLocation(location: Location): Observable<any> {
    return this.upsertLocation(location, true);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete<number>(this.endpoint(`location/${id}`));
  }

  /**
   * Plant related calls
   */

  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.endpoint('plant'));
  }

  getPlant(id: number): Observable<Plant> {
    return this.http.get<Plant>(this.endpoint(`plant/${id}`)).pipe(
      map(data => data),
      catchError((HttpError: HttpErrorResponse) => {
        if (HttpError.error.msg) {
          return throwError(() => {
            return { msg: HttpError.error.msg, code: HttpError.status }
          });
        }
        else return throwError(() => undefined);
      })
    );
  }

  createPlant(plant: Plant): Observable<any> {
    return this.http.post<Plant>(this.endpoint('plant'), plant).pipe(
      map((data: any) => {
        if (data.msg === 'PLANT_CREATED') return data;
        else return throwError(() => 'Server error');
      }),
      catchError(err => {
        return throwError(() => (
          {
            msg: err.error.msg,
            data: err.error.data ? err.error.data : undefined,
            code: err.status.code ? err.status.code : undefined
          }
        ));
      })
    )
  }

  updatePlant(plant: Plant): Observable<Plant> {
    return this.http.put<Plant>(this.endpoint('plant'), plant).pipe(
      map((data: any) => {
        if (data.msg === 'PLANT_UPDATED') return data.plant;
        else return throwError(() => 'Server error');
      }),
      catchError(err => {
        return throwError(() => (
          {
            msg: err.error.msg,
            data: err.error.data ? err.error.data : undefined,
            code: err.status.code ? err.status.code : undefined
          }
        ));
      })
    )
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete<number>(this.endpoint(`plant/${id}`));
  }

  /**
   * Photo related calls
   */

  getPhoto(id: number): Observable<Photo> {
    return this.http.get<Photo>(this.endpoint(`photo/${id}`)).pipe(
      map(data => data),
      catchError((HttpError: HttpErrorResponse) => {
        if (HttpError.error.msg) return throwError(() => { return { msg: HttpError.error.msg, code: HttpError.status } })
        else return throwError(() => undefined);
      })
    );
  }

  createPhoto(photo: Photo): Observable<any> {
    const form = new FormData();

    form.append('plantId', photo.plantId.toString());
    form.append('public', photo.public.toString());
    photo.pictureFiles.forEach((photo) => {
      form.append('photo', photo);
    });

    return this.http.post<Photo>(this.endpoint('photo'), form).pipe(
      map((data: any) => {
        if (data.msg === 'PHOTOS_CREATED') return data;
        else return throwError(() => 'Server error');
      }),
      catchError(err => {
        return throwError(() => (
          {
            msg: err.error.msg,
            data: err.error.data ? err.error.data : undefined,
            code: err.status.code ? err.status.code : undefined
          }
        ));
      })
    )
  }

  /**
   * Specie related calls
   */

  findSpecie(name: string): Observable<Specie[]> {
    return this.http.get<Specie[]>(this.endpoint(`specie/name/${name}`));
  }

  /**
   * Tasks related calls
   */

  getTasks(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.endpoint('tasks'));
  }
}
