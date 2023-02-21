import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { potChoices } from '@interfaces';
import { UnitPipe } from '@pipes/unit/unit.pipe';
import { PlantService } from '@services/plant.service';
import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';

@Component({
  standalone: true,
  selector: 'plant-widget-soil',
  imports: [
    CommonModule,
    UnitPipe,
    WidgetBoxComponent
  ],
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
