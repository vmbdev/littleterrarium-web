import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { Photo } from '@models/photo.model';
import { PictureItem } from '@models/picture-item.model';
import { Plant } from '@models/plant.model';
import { ImagePathService } from '@services/image-path.service';
import { PlantService } from '@services/plant.service';

@Component({
  standalone: true,
  selector: 'photo-list',
  imports: [
    CommonModule,
    PictureListComponent
  ],
  templateUrl: './photo-list.component.html',
  providers: [DatePipe]
})
export class PhotoListComponent implements OnInit {
  @Input() plantId?: number;
  @Input() owned: boolean = true;
  pictureList: PictureItem[] = [];

  constructor(
    public imagePath: ImagePathService,
    private datePipe: DatePipe,
    public plantService: PlantService
  ) { }

  ngOnInit(): void {
    this.plantService.plant$.subscribe((plant: Plant | null) => {
      if (plant?.photos) {
        this.pictureList = [];

        for (const photo of plant?.photos) {
          this.pictureList.push({
            image: this.imagePath.get(photo.images, 'thumb'),
            link: ['/photo', photo.id],
            name: this.datePipe.transform(photo.takenAt)!,
          });
        }
      }
    })
  }

}
