import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  of
} from 'rxjs';

import { LocationService } from '@services/location.service';
import { PlantService } from '@services/plant.service';
import { Location } from '@models/location.model';
import { Plant } from '@models/plant.model';

interface BreadcrumbLink {
  selector: string;
  name: string;
  link?: string | any[];
}

interface BreadcrumbOptions {
  attachTo?: string;
  parent?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private links: BehaviorSubject<BreadcrumbLink[]> = new BehaviorSubject<
    BreadcrumbLink[]
  >([]);
  public readonly links$ = this.links.asObservable();
  private prev: BreadcrumbLink[] = [];

  constructor(
    private readonly router: Router,
    private readonly locationService: LocationService,
    private readonly plantService: PlantService
  ) {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.prev = this.links.getValue();
        this.links.next([]);
      });
  }

  setNavigation(
    links: BreadcrumbLink[],
    options: BreadcrumbOptions = {}
  ): void {
    if (options.attachTo) {
      const newLinks: BreadcrumbLink[] = [];
      let found = false;
      let i = 0;

      while (i < this.prev.length && !found) {
        // if there's already an id with the one inserting,
        // stop searching and attach there
        if (this.prev[i].selector === links[0].selector) found = true;
        else {
          newLinks.push(this.prev[i]);

          if (this.prev[i].selector === options.attachTo) found = true;
        }

        i++;
      }

      // if there's no parent, we fetch it
      if (!found && options.parent) {
        switch (options.attachTo) {
          case 'location': {
            this.getParentLocation(options.parent).subscribe(
              (parentLink: BreadcrumbLink) => {
                this.links.next(newLinks.concat([parentLink], links));
              }
            );

            break;
          }

          case 'plant': {
            this.getParentPlant(options.parent).subscribe(
              (parentLinks: BreadcrumbLink[]) => {
                this.links.next(newLinks.concat(parentLinks, links));
              }
            );

            break;
          }
        }
      } else this.links.next(newLinks.concat([...links]));
    } else this.links.next(links);
  }

  getParentLocation(id: number): Observable<BreadcrumbLink> {
    return this.locationService.get(id).pipe(
      map((location: Location) => {
        return {
          selector: 'location',
          name: location.name,
          link: ['/location', location.id],
        };
      })
    );
  }

  getParentPlant(id: number): Observable<BreadcrumbLink[]> {
    return this.plantService.get(id).pipe(
      mergeMap((plant: Plant) => {
        return combineLatest([
          of({
            selector: 'plant',
            name: this.plantService.getVisibleName(plant),
            link: ['/plant', plant.id],
          }),
          this.getParentLocation(plant.locationId),
        ]);
      }),
      map(([plantlink, locationLink]) => {
        return [locationLink, plantlink];
      })
    );
  }

  empty(): void {
    this.links.next([]);
  }
}
