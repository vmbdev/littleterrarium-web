import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@models/location.model';
import { ApiService } from '@services/api.service';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { ImagePathService } from '@services/image-path.service';

@Component({
  standalone: true,
  selector: 'location-list',
  imports: [
    CommonModule,
    RouterModule,
    PictureBoxComponent
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  @Input() userId?: number;
  @Input() owned: boolean = true;
  list$?: Observable<Location[]>;

  constructor(
    private apiService: ApiService,
    public imagePath: ImagePathService
  ) { }

  ngOnInit(): void {
    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null
    }
    this.list$ = this.apiService.getLocationList(options);
  }

}
