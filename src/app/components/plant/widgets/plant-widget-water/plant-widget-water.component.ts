import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';

import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { PlantService } from '@services/plant.service';
import { ModalService } from '@services/modal.service';
import { Plant } from '@models/plant.model';
import { NextDateWidget } from '@models/next-date-widget.model';

@Component({
  standalone: true,
  selector: 'lt-plant-widget-water',
  imports: [CommonModule, WidgetBoxComponent, BoxIconComponent],
  templateUrl: './plant-widget-water.component.html',
})
export class PlantWidgetWaterComponent {
  @ViewChild('waterModal') waterModal!: TemplateRef<any>;

  protected nextDate: NextDateWidget = {
    text: null,
    due: false,
  };

  constructor(
    public readonly plantService: PlantService,
    private readonly modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.plantService.plant$.subscribe((plant: Plant | null) => {
      if (plant?.waterNext) {
        const date = DateTime.fromISO(plant.waterNext as string);

        this.nextDate = {
          text: date.toRelative(),
          due: date.diffNow('days').days < 0,
        };
      }
    });
  }

  openWaterModal(): void {
    this.modal.open(this.waterModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.addWater();
    });
  }

  addWater(): void {
    this.plantService.water().subscribe();
  }
}
