import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantWidgetWaterComponent {
  @ViewChild('waterModal') waterModal!: TemplateRef<any>;

  protected plant$?: Observable<Plant | null>;
  protected nextDate: NextDateWidget = {
    text: null,
    due: false,
  };

  constructor(
    protected readonly plantService: PlantService,
    private readonly modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.plant$ = this.plantService.plant$.pipe(
      tap((plant: Plant | null) => {
        if (plant?.waterNext) {
          const date = DateTime.fromISO(plant.waterNext as string);

          this.nextDate = {
            text: date.toRelative(),
            due: date.diffNow('days').days < 0,
          };
        }
      }),
      switchMap(() => this.plantService.plant$),
    );
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
