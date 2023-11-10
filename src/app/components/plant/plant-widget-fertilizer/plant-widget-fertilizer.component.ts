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
  selector: 'lt-plant-widget-fertilizer',
  imports: [
    CommonModule,
    ConfirmModalComponent,
    WidgetBoxComponent,
    PlusButtonComponent
  ],
  templateUrl: './plant-widget-fertilizer.component.html'
})
export class PlantWidgetFertilizerComponent {
  confirmFertilizing: boolean = false;
  nextDate: NextDateWidget = {
    text: null,
    due: false
  };

  constructor(public plantService: PlantService) {}

  ngOnInit(): void {
    this.plantService.plant$.subscribe((plant: Plant | null) => {
      if (plant?.fertNext) {
        const date = DateTime.fromISO(plant.fertNext as string);
  
        this.nextDate = {
          text: date.toRelative(),
          due: (date.diffNow('days').days < 0)
        }
      }
    })
  }

  addFertilizer(): void {
    this.confirmFertilizing = false;
    this.plantService.fertilize().subscribe();
  }
}
