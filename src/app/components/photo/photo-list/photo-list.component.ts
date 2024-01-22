import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  numberAttribute,
} from '@angular/core';

import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { Photo } from '@models/photo.model';
import { PictureItem } from '@models/picture-item.model';
import { ImagePathService } from '@services/image-path.service';
import { PlantService } from '@services/plant.service';

@Component({
  standalone: true,
  selector: 'lt-photo-list',
  imports: [CommonModule, PictureListComponent],
  templateUrl: './photo-list.component.html',
})
export class PhotoListComponent {
  @Input({ transform: numberAttribute }) plantId?: number;
  @Input({ transform: booleanAttribute }) owned: boolean = true;
  protected pictureList: PictureItem[] = [];

  constructor(
    public imagePath: ImagePathService,
    private plantService: PlantService,
  ) {}

  ngOnInit(): void {
    if (this.plantId) {
      const photos$ = this.plantService.getPhotos(this.plantId);

      photos$.subscribe((photos: Photo[]) => {
        this.setPictureList(photos);
      });
    }
  }

  setPictureList(photos: Photo[]) {
    this.pictureList = [];

    for (const photo of photos) {
      this.pictureList.push({
        image: this.imagePath.get(photo.images, 'thumb'),
        link: ['/photo', photo.id],
        sortableOptions: {
          date: photo.takenAt,
        },
      });
    }
  }
}
