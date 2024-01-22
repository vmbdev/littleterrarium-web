import { Component } from '@angular/core';

import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';

@Component({
  standalone: true,
  selector: 'lt-plant-all',
  imports: [PlantListComponent],
  templateUrl: './plant-all.component.html',
})
export class PlantAllComponent {}
