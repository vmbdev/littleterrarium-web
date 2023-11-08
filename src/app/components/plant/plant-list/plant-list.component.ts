import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import {
  PictureListComponent
} from '@components/picture-list/picture-list.component';
import {
  FilterBarComponent
} from "@components/filter-bar/filter-bar.component";
import { SortColumn, SortOption, SortOrder } from '@models/sort-options.model';
import { PlantService } from '@services/plant.service';
import { LocationService } from '@services/location.service';
import { PlantGetConfig } from '@services/api.service';
import { PictureItem } from '@models/picture-item.model';
import { Plant } from '@models/plant.model';
import { User } from '@models/user.model';

@Component({
  standalone: true,
  selector: 'lt-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    PictureListComponent,
    FilterBarComponent
  ]
})
export class PlantListComponent {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() user?: User;
  @Input() owned: boolean = true;
  order: SortOrder;
  sort: SortColumn;

  cursor?: number;
  lastCursor?: number;

  filter?: string;
  pictureList: PictureItem[] = [];

  constructor(
    private plantService: PlantService,
    private locationService: LocationService
  ) { 
    // FIXME: get and store in LocalStorage
    this.order = 'asc';
    this.sort = 'name';
  }

  ngOnInit(): void {
    if (this.list) {
      this.pictureList = this.createPictureListFromPlants(this.list);
    }
    else this.fetchPlants();
  }

  fetchPlants(scroll: boolean = false): void {
    let obs$: Observable<Plant[]>;
    let options: PlantGetConfig = {
      cursor: scroll && this.cursor ? this.cursor : undefined,
      filter: this.filter ? this.filter : '',
      sort: this.sort,
      order: this.order
    }

    // in case of multiple bottom reached signals, we avoid asking twice
    if (this.cursor) this.lastCursor = this.cursor;

    if (this.locationId) {
      obs$ = this.locationService.getPlants(this.locationId, options);
    }
    else {
      options = {
        ...options,
        userId: this.user?.id,
        cover: true
      };

      obs$ = this.plantService.getMany(options);
    }

    obs$.subscribe((plants: Plant[]) => {
      if (plants.length > 0) {
        this.cursor = plants[plants.length - 1].id;
      }

      if (scroll) {
        this.pictureList = ([
          ...this.pictureList,
          ...this.createPictureListFromPlants(plants)
        ]);
      }
      else this.pictureList = this.createPictureListFromPlants(plants);
    });
  }

  createPictureListFromPlants(plants: Plant[]): PictureItem[] {
    const pictures = [];

    for (const plant of plants) {
      if (!plant.visibleName) {
        plant.visibleName = this.plantService.getVisibleName(plant);
      }

      pictures.push({
        image: this.plantService.coverPhoto(plant),
        link: ['/plant', plant.id],
        name: plant.visibleName,
        sortableOptions: {
          date: plant.createdAt
        }
      });

    }

    return pictures;
  }

  changeSorting(sorting: SortOption): void {
    this.sort = sorting.column;
    this.order = sorting.order;

    this.fetchPlants();
  }

  changeFilter(val: string): void {
    this.filter = val;

    this.fetchPlants();
  }

  loadMore(): void {
    if (this.cursor !== this.lastCursor) this.fetchPlants(true);
  }
}
