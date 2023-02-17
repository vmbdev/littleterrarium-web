import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  @Input() userId?: number;
  @Input() owned: boolean = true;
  list?: Observable<Location[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null
    }
    this.list = this.apiService.getLocationList(options);
  }

}
