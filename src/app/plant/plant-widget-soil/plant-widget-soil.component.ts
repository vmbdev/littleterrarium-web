import { Component, OnInit } from '@angular/core';
import { potChoices } from 'src/app/interfaces';
import { PlantService } from '../../plant-service/plant.service';

@Component({
  selector: 'plant-widget-soil',
  templateUrl: './plant-widget-soil.component.html'
})
export class PlantWidgetSoilComponent implements OnInit {
  constructor(public plantService: PlantService) { }

  ngOnInit(): void {
  }

  getPotName(): string {
    let potName;
    const potType = this.plantService.plant$.getValue()?.potType;

    if (potType) {
      if (potChoices.hasOwnProperty(potType)) potName = potChoices[potType].name;
      else potName = potType;
    }
    else potName = $localize `:@@general.unknown:Unknown`;

    return potName;
  }
}
