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
  selector: 'lt-plant-widget-fertilizer',
  imports: [CommonModule, WidgetBoxComponent, BoxIconComponent],
  templateUrl: './plant-widget-fertilizer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantWidgetFertilizerComponent {
  @ViewChild('fertModal') fertModal!: TemplateRef<any>;

  protected plant$?: Observable<Plant | null>;
  protected nextDate: NextDateWidget = {
    text: null,
    due: false,
  };

  constructor(
    public readonly plantService: PlantService,
    private readonly modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.plant$ = this.plantService.plant$.pipe(
      tap((plant: Plant | null) => {
        if (plant?.fertNext) {
          const date = DateTime.fromISO(plant.fertNext as string);

          this.nextDate = {
            text: date.toRelative(),
            due: date.diffNow('days').days < 0,
          };
        }
      }),
      switchMap(() => this.plantService.plant$),
    );
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
