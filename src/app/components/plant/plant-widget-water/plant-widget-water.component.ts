import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DateTime } from 'luxon';

import {
  ConfirmModalComponent
} from '@components/modals/confirm-modal/confirm-modal.component';
import {
  WidgetBoxComponent
} from '@components/widget-box/widget-box.component';
import {
  PlusButtonComponent
} from '@components/plus-button/plus-button.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { NextDateWidget } from '@models/next-date-widget.model';

@Component({
  standalone: true,
  selector: 'lt-plant-widget-water',
  imports: [
    CommonModule,
    ConfirmModalComponent,
    WidgetBoxComponent,
    PlusButtonComponent
  ],
  templateUrl: './plant-widget-water.component.html'
})
export class PlantWidgetWaterComponent {
  confirmWatering: boolean = false;
  nextDate: NextDateWidget = {
    text: null,
    due: false
  };

  constructor(public plantService: PlantService) { }

  ngOnInit(): void {
    this.plantService.plant$.subscribe((plant: Plant | null) => {
      if (plant?.waterNext) {
        const date = DateTime.fromISO(plant.waterNext as string);
  
        this.nextDate = {
          text: date.toRelative(),
          due: (date.diffNow('days').days < 0)
        }
      }
    })
  }

  addWater(): void {
    this.confirmWatering = false;
    this.plantService.water().subscribe();
  }

}

