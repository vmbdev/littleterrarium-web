import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { PictureItem } from '@models/picture-item.model';
import { FilterBarComponent } from "@components/filter-bar/filter-bar.component";
import { SortOptions } from '@models/sort-options.model';
import { LocationService } from '@services/location.service';
import { Observable } from 'rxjs';

@Component({
    standalone: true,
    selector: 'plant-list',
    templateUrl: './plant-list.component.html',
    styleUrls: ['./plant-list.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        PictureListComponent,
        FilterBarComponent
    ]
})
export class PlantListComponent implements OnInit {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() userId?: number;
  @Input() owned: boolean = true;
  sortBy: string = 'name';
  sortOrder: SortOptions = 'asc';
  filter?: string;
  pictureList: PictureItem[] = [];

  constructor(
    private plantService: PlantService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    if (this.list) this.setPictureList(this.list);
    else {
      let obs: Observable<Plant[]>;

      if (this.locationId) {
        obs = this.locationService.getPlants(this.locationId);
      }
      else {
        const options = {
          userId: this.userId,
          cover: true
        };

        obs = this.plantService.getMany(options);
      }

      obs.subscribe((plants: Plant[]) => {
        this.setPictureList(plants);
      });
    }
  }

  setPictureList(plants: Plant[]) {
    this.pictureList = [];

    for (const plant of plants) {
      if (!plant.visibleName) plant.visibleName = this.plantService.getVisibleName(plant);

      this.pictureList.push({
        image: this.plantService.coverPhoto(plant),
        link: ['/plant', plant.id],
        name: plant.visibleName,
        sortableOptions: {
          date: plant.createdAt
        }
      });

    }
  }

  changeSorting(val: any): void {
    this.sortBy = val.field;
    this.sortOrder = val.order;
  }

  changeFilter(val: string): void {
    this.filter = val;
  }
}
