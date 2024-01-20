import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { PlantService } from '@services/plant.service';
import { UnitPipe } from '@pipes/unit/unit.pipe';

@Component({
  standalone: true,
  selector: 'lt-plant-widget-soil',
  imports: [CommonModule, UnitPipe, WidgetBoxComponent],
  templateUrl: './plant-widget-soil.component.html',
})
export class PlantWidgetSoilComponent {
  potName?: string;

  constructor(public plantService: PlantService) {}

  ngOnInit(): void {
    this.potName = this.getPotName();
  }

  getPotName(): string {
    let potName;
    const potType = this.plantService.current()?.potType;

    if (potType) potName = this.plantService.getPotInfo(potType).name;
    else potName = $localize`:@@general.unknown:Unknown`;

    return potName;
  }
}
