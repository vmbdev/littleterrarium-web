import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@services/api.service';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';
import { User } from '@models/user.model';

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
