import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  standalone: true,
  selector: 'lt-terrarium',
  imports: [
    CommonModule,
    LocationListComponent,
    PlantListComponent,
    ImagePathPipe,
  ],
  templateUrl: './terrarium.component.html',
  styleUrls: ['./terrarium.component.scss'],
})
export class TerrariumComponent {
  user$ = new BehaviorSubject<User | null>(null);
  fullName: string = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {
    const username = this.route.snapshot.paramMap.get('username');

    if (username) {
      this.api
        .getUserByName(username)
        .pipe(takeUntilDestroyed())
        .subscribe((user: User | null) => {
          if (user) {
            this.user$.next(user);
            this.fullName = this.getFullName(user);
          }
        });
    }
  }

  getFullName(user: User): string {
    const firstname = user.firstname ? user.firstname + ' ' : '';

    return `${firstname}${user.lastname}`;
  }
}
