import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { Photo } from '@models/photo.model';
import { PictureItem } from '@models/picture-item.model';
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
    private plantService: PlantService
  ) { }

  ngOnInit(): void {
    if (this.plantId) {
      this.plantService.getPhotos(this.plantId).subscribe((photos: Photo[]) => {
        this.setPictureList(photos);
      })
    }
  }

  setPictureList(photos: Photo[]) {
    this.pictureList = [];

    for (const photo of photos) {
      this.pictureList.push({
        image: this.imagePath.get(photo.images, 'thumb'),
        link: ['/photo', photo.id],
        name: this.datePipe.transform(photo.takenAt)!,
        sortableOptions: {
          date: photo.takenAt
        }
      });
    }
  }

}
