import { Component, Input, OnInit } from '@angular/core';
import { Plant } from 'src/app/interfaces';

@Component({
  selector: 'plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent implements OnInit {
  @Input() list!: Plant[];
  @Input() locationId?: number;
  @Input() center?: boolean = false;
  @Input() owned: boolean = true;
  pictures: any[] = [];

  constructor() { }

  ngOnInit(): void {
    for (const plant of this.list) {
      const pic = {
        id: plant.id,
        name: plant.customName,
        image: plant.photos?.at(0)?.images.thumb
      };

      this.pictures.push(pic);
    }
  }

}
