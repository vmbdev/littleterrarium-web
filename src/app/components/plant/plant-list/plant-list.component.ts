import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { PictureItem } from '@models/picture-item.model';
import { FilterBarComponent } from "../../filter-bar/filter-bar/filter-bar.component";
import { SortOptions } from '@models/sort-options.model';

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
    private plantService: PlantService
  ) { }

  ngOnInit(): void {
    if (this.list) this.setPictureList(this.list);
    else {
      const options = {
        locationId: this.locationId,
        userId: this.userId,
        cover: true
      };

      this.plantService.getMany(options).subscribe((plants: Plant[]) => {
        this.setPictureList(plants);
      })
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
