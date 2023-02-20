import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Photo, Plant } from '../interfaces';
import { PhotoService } from '../photo/photo.service';
import { ApiService } from '../shared/api/api.service';
import { CapitalizePipe } from '../shared/capitalize/capitalize.pipe';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  plant$: BehaviorSubject<Plant | null> = new BehaviorSubject<Plant | null>(null);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private capitalizePipe: CapitalizePipe,
    private photoService: PhotoService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) { }

  create(plant: Plant, photoFiles: File[]): Observable<any> {
    let newPlantId: number;

    return this.api.createPlant(plant).pipe(
      switchMap((res: any) => {
        const plant: Plant = res.data.plant;
        newPlantId = plant.id;

        if (photoFiles.length === 0) return of(res);
        else {
          const photos = {
            plantId: plant.id,
            public: plant.public,
            pictureFiles: photoFiles
          } as Photo;

          return this.photoService.create(photos, true).pipe(
            catchError(() => {
              // Plant is created even though photo upload may have failed - we redirect to Plant
              // FIXME: move it to the component?
              this.router.navigate(['/plant', newPlantId]);
      
              return EMPTY;
            }))
        }
      })
    );
  }

  get(id: number): Observable<any> {
    return this.api.getPlant(id).pipe(
      map((plant: Plant) => {
        this.owned = (this.auth.user$.getValue()?.id === plant.ownerId);
        plant.visibleName = this.getVisibleName(plant);

        this.plant$.next(plant);

        return plant;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.plant$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  getMany(options: any): Observable<Plant[]> {
    return this.api.getPlants(options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.getVisibleName(plant);
        }

        return plants;
      })
    );
  }

  getVisibleName(plant: Plant): string {
    let name;

    if (plant.customName) name = plant.customName;
    else if (plant.specie?.name) name = this.capitalizePipe.transform(plant.specie.name);
    else name = $localize `:@@general.unnamedPlant:Unnamed plant ${plant.id}:plantId:`;

    return name;
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
