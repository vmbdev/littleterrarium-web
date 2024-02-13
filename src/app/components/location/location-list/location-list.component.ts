import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lt-location-list',
  imports: [CommonModule, RouterModule, PictureListComponent],
  templateUrl: './location-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationListComponent {
  @Input({ transform: numberAttribute }) userId?: number;
  @Input({ transform: booleanAttribute }) owned: boolean = true;
  protected pictureList$?: Observable<PictureItem[]>;

  constructor(
    private readonly locationService: LocationService,
    public imagePath: ImagePathService
  ) {}

  ngOnInit(): void {
    this.pictureList$ = this.locationService
    .getMany({ plantCount: true, userId: this.userId ?? null })
    .pipe(
      map((locations: Location[]) => {
        const pictureList = [];

        for (const location of locations) {
          const plantCount = location._count?.plants ?? 0;

          pictureList.push({
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

        return pictureList;
      })
    );
  }
}
