import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  WidgetBoxComponent
} from '@components/widget-box/widget-box.component';
import { PlantService } from '@services/plant.service';
import { potChoices } from '@models/plant.model';
import { UnitPipe } from '@pipes/unit/unit.pipe';

@Component({
  standalone: true,
  selector: 'lt-plant-widget-soil',
  imports: [CommonModule, UnitPipe, WidgetBoxComponent],
  templateUrl: './plant-widget-soil.component.html',
})
export class PlantWidgetSoilComponent {
  constructor(public plantService: PlantService) {}

  getPotName(): string {
    let potName;
    const potType = this.plantService.current()?.potType;

    if (potType) {
      if (potChoices.hasOwnProperty(potType)) {
        potName = potChoices[potType].name;
      } else potName = potType;
    } else potName = $localize`:@@general.unknown:Unknown`;

    return potName;
  }
}
