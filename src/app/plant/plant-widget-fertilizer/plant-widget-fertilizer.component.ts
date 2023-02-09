import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
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
  usableLocale: string = 'en';

  constructor(
    public plantService: PlantService,
    @Inject(LOCALE_ID) public currentLocale: string
  ) {
    dayjs.extend(relativeTime);
    dayjs.extend(isSameOrBefore);
    import(`dayjs/locale/${currentLocale}`)
      .then(() => { this.usableLocale = currentLocale })
      .catch(() => { this.usableLocale = 'en' })
  }

  ngOnInit(): void {
  }

  addFertilizer(): void {
    this.confirmFertilizing = false;
    this.plantService.fertilize().subscribe();
  }

  nextFertilizing(): any {
    const fertNext = this.plantService.plant$.getValue()?.fertNext;

    if (fertNext) {
      return {
        text: dayjs(fertNext).locale(this.usableLocale).fromNow(),
        due: dayjs(fertNext).isSameOrBefore(dayjs())
      }
    }
    else return null;
  }

}
