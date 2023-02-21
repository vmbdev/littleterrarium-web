import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as dayjs from 'dayjs';
import { PlantService } from '@services/plant.service';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { PlusButtonComponent } from '@components/plus-button/plus-button.component';

@Component({
  standalone: true,
  selector: 'plant-widget-fertilizer',
  imports: [
    CommonModule,
    ConfirmModalComponent,
    WidgetBoxComponent,
    PlusButtonComponent
  ],
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
