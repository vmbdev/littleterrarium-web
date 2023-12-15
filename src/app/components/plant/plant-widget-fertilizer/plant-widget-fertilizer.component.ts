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
  selector: 'lt-plant-widget-fertilizer',
  imports: [CommonModule, WidgetBoxComponent, PlusButtonComponent],
  templateUrl: './plant-widget-fertilizer.component.html',
})
export class PlantWidgetFertilizerComponent {
  @ViewChild('fertModal') fertModal!: TemplateRef<any>;

  nextDate: NextDateWidget = {
    text: null,
    due: false,
  };

  constructor(public plantService: PlantService, private modal: ModalService) {}

  ngOnInit(): void {
    this.plantService.plant$.subscribe((plant: Plant | null) => {
      if (plant?.fertNext) {
        const date = DateTime.fromISO(plant.fertNext as string);

        this.nextDate = {
          text: date.toRelative(),
          due: date.diffNow('days').days < 0,
        };
      }
    });
  }

  openFertModal(): void {
    this.modal.open(this.fertModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.addFertilizer();
    });
  }

  addFertilizer(): void {
    this.plantService.fertilize().subscribe();
  }
}
