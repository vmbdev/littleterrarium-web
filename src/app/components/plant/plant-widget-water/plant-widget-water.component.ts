import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { PlantService } from '@services/plant.service';
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as dayjs from 'dayjs';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { PlusButtonComponent } from '@components/plus-button/plus-button.component';

@Component({
  standalone: true,
  selector: 'plant-widget-water',
  imports: [
    CommonModule,
    ConfirmModalComponent,
    WidgetBoxComponent,
    PlusButtonComponent
  ],
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
    const waterNext = this.plantService.current()?.waterNext;

    if (waterNext) {
      return {
        text: dayjs(waterNext).locale(this.usableLocale).fromNow(),
        due: dayjs(waterNext).isSameOrBefore(dayjs())
      }
    }
    else return null;
  }

}

