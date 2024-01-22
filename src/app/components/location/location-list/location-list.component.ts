import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { ImagePathService } from '@services/image-path.service';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';
import { PictureItem } from '@models/picture-item.model';

@Component({
  standalone: true,
  selector: 'lt-location-list',
  imports: [CommonModule, RouterModule, PictureListComponent],
  templateUrl: './location-list.component.html',
})
export class LocationListComponent {
  @Input({ transform: numberAttribute }) userId?: number;
  @Input({ transform: booleanAttribute }) owned: boolean = true;
  protected pictureList: PictureItem[] = [];

  constructor(
    private readonly locationService: LocationService,
    public imagePath: ImagePathService,
  ) {}

  ngOnInit(): void {
    const options = {
      plantCount: true,
      userId: this.userId ?? null,
    };
    const list$ = this.locationService.getMany(options);

    list$.subscribe((locations: Location[]) => {
      this.pictureList = [];

      for (const location of locations) {
        const plantCount = location._count?.plants ?? 0;

        this.pictureList.push({
          image: location.pictures
            ? this.imagePath.get(location.pictures, 'thumb')
            : null,
          link: ['/location', location.id],
          name: location.name,
          description: [
            $localize`:@@location-list.amount:${
              plantCount > 0 ? plantCount : 'No'
            }:plantCount: plants here`,
          ],
        });
      }
    });
  }
}
