import { Component, OnInit } from '@angular/core';
import { PlantService } from '../plant.service';
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as dayjs from 'dayjs';

@Component({
  selector: 'plant-widget-fertilizer',
  templateUrl: './plant-widget-fertilizer.component.html'
})
export class PlantWidgetFertilizerComponent implements OnInit {
  confirmFertilizing: boolean = false;

  constructor(public plantService: PlantService) {
    dayjs.extend(relativeTime);
    dayjs.extend(isSameOrBefore);
  }

  ngOnInit(): void {
  }

  addFertilizer(): void {
    this.confirmFertilizing = false;
    this.plantService.fertilize().subscribe();
  }

  nextFertilizing(): any {
    const { fertNext } = this.plantService.plant$.getValue();
    if (fertNext) {
      return {
        text: dayjs(fertNext).fromNow(),
        due: dayjs(fertNext).isSameOrBefore(dayjs())
      }
    }
    else return null;
  }

}
