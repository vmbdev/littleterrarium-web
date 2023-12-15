import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@models/location.model';
import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { PictureItem } from '@models/picture-item.model';
import {
  PictureListComponent
} from '@components/picture-list/picture-list.component';

@Component({
  standalone: true,
  selector: 'lt-location-list',
  imports: [CommonModule, RouterModule, PictureListComponent],
  templateUrl: './location-list.component.html',
})
export class LocationListComponent {
  @Input({ transform: numberAttribute }) userId?: number;
  @Input({ transform: booleanAttribute }) owned: boolean = true;
  pictureList: PictureItem[] = [];

  constructor(
    private apiService: ApiService,
    public imagePath: ImagePathService
  ) {}

  ngOnInit(): void {
    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null,
    };
    const list$ = this.apiService.getLocationList(options);

    list$.subscribe((locations: Location[]) => {
      this.pictureList = [];

      for (const location of locations) {
        const plantCount = location._count?.plants ? location._count.plants : 0;

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
