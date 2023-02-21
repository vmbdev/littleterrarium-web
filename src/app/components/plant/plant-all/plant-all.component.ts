import { Component, OnInit } from '@angular/core';
import { PlantListComponent } from '../plant-list/plant-list.component';

@Component({
  standalone: true,
  selector: 'plant-all',
  imports: [PlantListComponent],
  templateUrl: './plant-all.component.html',
  styleUrls: ['./plant-all.component.scss']
})
export class PlantAllComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }

}
