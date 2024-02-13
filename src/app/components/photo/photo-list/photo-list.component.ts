import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
} from '@angular/core';
import { map, Observable } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoListComponent {
  @Input({ transform: numberAttribute }) plantId?: number;
  @Input({ transform: booleanAttribute }) owned: boolean = true;
  protected pictureList$?: Observable<PictureItem[]>;

  constructor(
    public imagePath: ImagePathService,
    private plantService: PlantService,
  ) {}

  ngOnInit(): void {
    if (this.plantId) {
      this.pictureList$ = this.plantService.getPhotos(this.plantId).pipe(
        map((photos: Photo[]) => {
          return this.setPictureList(photos);
        }),
      );
    }
  }

  setPictureList(photos: Photo[]) {
    const pictureList: PictureItem[] = [];

    for (const photo of photos) {
      pictureList.push({
        image: this.imagePath.get(photo.images, 'thumb'),
        link: ['/photo', photo.id],
        sortableOptions: {
          date: photo.takenAt,
        },
      });
    }

    return pictureList;
  }
}
