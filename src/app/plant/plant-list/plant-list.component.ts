import { Component, Input, OnInit } from '@angular/core';
import { Plant } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent implements OnInit {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() userId?: number;
  @Input() center?: boolean = false;
  @Input() owned: boolean = true;
  pictures: any[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    if (this.list) {
      this.setPictureList(this.list);
    }
    else {
      const options = {
        locationId: this.locationId,
        userId: this.userId
      };
  
      this.api.getPlants(options).subscribe((plants: Plant[]) => {
        this.setPictureList(plants);
      })
    }
  }

  setPictureList(plants: Plant[]) {
    for (const plant of plants) {
      const pic = {
        id: plant.id,
        name: plant.customName,
        image: plant.photos?.at(0)?.images.thumb
      };

      this.pictures.push(pic);
    }
  }
}
