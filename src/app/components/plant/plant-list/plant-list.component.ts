import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { ImagePathService } from '@services/image-path.service';

@Component({
  standalone: true,
  selector: 'plant-list',
  imports: [
    CommonModule,
    RouterModule,
    PictureBoxComponent
  ],
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
    private plantService: PlantService,
    private imagePath: ImagePathService
  ) { }

  ngOnInit(): void {
    if (this.list) this.setPictureList(this.list);
    else {
      const options = {
        locationId: this.locationId,
        userId: this.userId
      };
  
      this.plantService.getMany(options).subscribe((plants: Plant[]) => {
        this.setPictureList(plants);
      })
    }
  }

  setPictureList(plants: Plant[]) {
    for (const plant of plants) {
      if (!plant.visibleName) plant.visibleName = this.plantService.getVisibleName(plant);

      const pic = {
        id: plant.id,
        name: plant.visibleName,
        image: this.imagePath.get(plant.photos?.at(0)?.images, 'thumb')
      };

      this.pictures.push(pic);
    }
  }
}
