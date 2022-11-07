import { Component, OnInit } from '@angular/core';
import { PlantService } from '../plant.service';
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as dayjs from 'dayjs';

@Component({
  selector: 'plant-widget-water',
  templateUrl: './plant-widget-water.component.html'
})
export class PlantWidgetWaterComponent implements OnInit {
  confirmWatering: boolean = false;

  constructor(public plantService: PlantService) {
    dayjs.extend(relativeTime);
    dayjs.extend(isSameOrBefore);
  }

  ngOnInit(): void {
  }

  addWater(): void {
    this.confirmWatering = false;
    this.plantService.water().subscribe();
  }

  nextWatering(): any {
    const { waterNext } = this.plantService.plant$.getValue();
    if (waterNext) {
      return {
        text: dayjs(waterNext).fromNow(),
        due: dayjs(waterNext).isSameOrBefore(dayjs())
      }
    }
    else return null;
  }

}

