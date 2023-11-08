import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';

@Component({
  standalone: true,
  selector: 'lt-terrarium',
  imports: [
    CommonModule,
    LocationListComponent,
    PlantListComponent
  ],
  templateUrl: './terrarium.component.html',
  styleUrls: ['./terrarium.component.scss']
})
export class TerrariumComponent implements OnInit {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private imagePath: ImagePathService
  ) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (username) {
      this.api.getUserByName(username).subscribe(this.user$);
    }
  }

  getUserAvatar(): string | null {
    const user = this.user$.getValue();

    if (user) {
      return (
        user.avatar ?
        this.imagePath.get(user.avatar, 'thumb') :
        'assets/user.png'
      );
    }
    else return null;
  }

  getFullName(): string | null {
    const user = this.user$.getValue();
    
    if (user) {
      const firstname = user.firstname ? user.firstname + ' ' : '';

      return `${firstname}${user.lastname}`;
    }
    else return null;
  }

}
