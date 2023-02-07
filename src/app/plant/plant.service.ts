import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Plant } from '../interfaces';
import { ApiService } from '../shared/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  plant$: BehaviorSubject<Plant | null> = new BehaviorSubject<Plant | null>(null);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) { }

  get(id: number): Observable<any> {
    return this.api.getPlant(id).pipe(
      map((plant: Plant) => {
        this.owned = (this.auth.user$.getValue()?.id === plant.ownerId);

        if (plant.customName) plant.visibleName = plant.customName;
        else if (plant.specie?.name) plant.visibleName = plant.specie.name;
        else plant.visibleName = $localize `:@@general.unnamedPlant:Unnamed plant ${plant.id}:plantId:`;

        this.plant$.next(plant);

        return plant;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  update(plant: Plant, options?: any): Observable<any> {
    return this.api.updatePlant(plant, options).pipe(
      map((plant: Plant) => {
        const current = this.plant$.getValue();

        if (current) {
          plant.photos = current.photos;
          this.plant$.next(plant);
        }
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(): Observable<any> {
    const id = this.plant$.getValue()?.id;

    if (id) return this.api.deletePlant(id);
    else return EMPTY;
  }

  fertilize(): Observable<any> {
    const id = this.plant$.getValue()?.id;

    if (id) {
      const updatedPlant = {
        id: id,
        fertLast: new Date()
      } as Plant;
      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  water(): Observable<any> {
    const id = this.plant$.getValue()?.id;

    if (id) {
      const updatedPlant = {
        id: id,
        waterLast: new Date()
      } as Plant;
      return this.update(updatedPlant);
    }

    return EMPTY;
  }
}
