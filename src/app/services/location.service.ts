import { BehaviorSubject, EMPTY, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  ApiService,
  LocationGetConfig,
  LocationUpsertConfig,
  PlantGetConfig,
} from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { PlantService } from '@services/plant.service';
import { Location } from '@models/location.model';
import { Plant } from '@models/plant.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private location = new BehaviorSubject<Location | null>(null);
  public location$ = this.location.asObservable();
  private owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private plantService: PlantService
  ) {}

  create(location: Location): Observable<Location> {
    this.location.next(null);

    return this.api.createLocation(location).pipe(
      map((location: Location) => {
        this.location.next(location);

        return location;
      })
    );
  }

  get(id: number, options?: LocationGetConfig): Observable<Location> {
    this.location.next(null);

    return this.api.getLocation(id, options).pipe(
      map((location: Location) => {
        this.owned = this.auth.getUser()?.id === location.ownerId;

        this.location.next(location);

        return location;
      })
    );
  }

  getMany(options?: LocationGetConfig): Observable<Location[]> {
    return this.api.getLocationList(options);
  }

  getPlants(id: number, options?: PlantGetConfig): Observable<Plant[]> {
    return this.api.getLocationPlants(id, options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.plantService.getVisibleName(plant);
        }

        return plants;
      })
    );
  }

  update(
    location: Location,
    options?: LocationUpsertConfig
  ): Observable<Location> {
    return this.api.updateLocation(location, options).pipe(
      map((location: Location) => {
        this.location.next(location);

        return location;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.api.deleteLocation(id).pipe(
      map(() => {
        this.location.next(null);

        return EMPTY;
      })
    );
  }

  current(): Location | null {
    return this.location.getValue();
  }

  isOwned(): boolean {
    return this.owned;
  }

  getLightName(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = $localize`:@@light.fullsunDesc:Full sun`;
        break;
      }
      case 'PARTIALSUN': {
        desc = $localize`:@@light.partialsunDesc:Partial sun`;
        break;
      }
      default: {
        desc = $localize`:@@light.shadeDesc:Shade`;
        break;
      }
    }

    return desc;
  }

  getLightVerbose(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = $localize`:@@light.fullsunVerbose:Sun shines over the whole day`;
        break;
      }
      case 'PARTIALSUN': {
        desc = $localize`:@@light.partialsunVerbose:Sun is here for a few hours each day`;
        break;
      }
      default: {
        desc = $localize`:@@light.shadeVerbose:Sun is not allowed here`;
        break;
      }
    }

    return desc;
  }

  getLightAsset(light: string): string {
    let name: string;

    if (light === 'FULLSUN') name = 'fullsun';
    else if (light === 'PARTIALSUN') name = 'partial';
    else name = 'shade';

    return `assets/light-${name}.png`;
  }
}
