import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';

import {
  WidgetBoxComponent
} from '@components/widget-box/widget-box.component';
import {
  PlusButtonComponent
} from '@components/plus-button/plus-button.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { NextDateWidget } from '@models/next-date-widget.model';
import { ModalService } from '@services/modal.service';

@Component({
  standalone: true,
  selector: 'lt-plant-widget-water',
  imports: [
    CommonModule,
    WidgetBoxComponent,
    PlusButtonComponent
  ],
  templateUrl: './plant-widget-water.component.html'
})
export class PlantWidgetWaterComponent {
  @ViewChild('waterModal') waterModal!: TemplateRef<any>;

  nextDate: NextDateWidget = {
    text: null,
    due: false
  };

  constructor(
    public plantService: PlantService,
    private modal: ModalService
  ) { }

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

  openWaterModal(): void {
    this.modal.open(this.waterModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.addWater();
    })
  }

  addWater(): void {
    this.plantService.water().subscribe();
  }

}

