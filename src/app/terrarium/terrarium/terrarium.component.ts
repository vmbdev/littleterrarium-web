import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, Plant, User } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'app-terrarium',
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
