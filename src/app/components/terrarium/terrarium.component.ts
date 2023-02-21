import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, Plant, User } from '@interfaces';
import { ApiService } from '@services/api.service';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';

@Component({
  standalone: true,
  selector: 'terrarium',
  imports: [
    CommonModule,
    LocationListComponent,
    PlantListComponent
  ],
  templateUrl: './terrarium.component.html',
  styleUrls: ['./terrarium.component.scss']
})
export class TerrariumComponent implements OnInit {
  user?: User;
  locations?: Location[];
  plants?: Plant[];


  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if (username) {
      this.api.getUserByName(username).subscribe((user: User) => {
        this.user = user;
      });
    }
  }

}
