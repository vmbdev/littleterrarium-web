import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Plant } from '../interfaces';
import { ApiService } from '../shared/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  plant$: BehaviorSubject<Plant> = new BehaviorSubject<Plant>({} as Plant);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService
    ) { }

  get(id: number): Observable<any> {
    return this.api.getPlant(id).pipe(
      map((plant: Plant) => {
        this.owned = (this.auth.user$.getValue()?.id === plant.ownerId);
        this.plant$.next(plant);

        return plant;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next({} as Plant);

        return throwError(() => HttpError.error);
      })
    );
  }

  getPlantName(): string {
    const plant = this.plant$.getValue();
    let title: string;

    if (plant.customName) title = plant.customName;
    else if (plant.specie) title = plant.specie.name;
    else title = `Plant ${plant.id}`;

    return title;
  }

  update(plant: Plant): Observable<any> {
    return this.api.updatePlant(plant).pipe(
      map((plant: Plant) => {
        const current = this.plant$.getValue();
        plant.photos = current.photos;
        this.plant$.next(plant);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next({} as Plant);

        return throwError(() => HttpError.error);
      })
    );
  }

  delete(): Observable<any> {
    const { id } = this.plant$.getValue();

    return this.api.deletePlant(id);
  }

  fertilize(): Observable<any> {
    const { id } = this.plant$.getValue();
    const updatedPlant = {
      id: id,
      fertLast: new Date()
    } as Plant;

    return this.update(updatedPlant);
  }

  water(): Observable<any> {
    const { id } = this.plant$.getValue();
    const updatedPlant = {
      id: id,
      waterLast: new Date()
    } as Plant;

    return this.update(updatedPlant);
  }
}
