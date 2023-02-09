import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
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

  addWater(): void {
    this.confirmWatering = false;
    this.plantService.water().subscribe();
  }

  nextWatering(): any {
    const waterNext = this.plantService.plant$.getValue()?.waterNext;

    if (waterNext) {
      return {
        text: dayjs(waterNext).locale(this.usableLocale).fromNow(),
        due: dayjs(waterNext).isSameOrBefore(dayjs())
      }
    }
    else return null;
  }

}

