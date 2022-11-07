import { Component, OnInit } from '@angular/core';
import { Plant } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'app-plant-all',
  templateUrl: './plant-all.component.html',
  styleUrls: ['./plant-all.component.scss']
})
export class PlantAllComponent implements OnInit {
  plants?: Plant[];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getPlants().subscribe((data: Plant[]) => {
      this.plants = data;
    });
  }

}
