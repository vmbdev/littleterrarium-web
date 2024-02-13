import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';

import { PlantEditActionComponent } from '@components/plant/editing/plant-edit-action/plant-edit-action.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit-watering',
  imports: [ReactiveFormsModule],
  templateUrl: './plant-edit-watering.component.html',
  styleUrls: ['./plant-edit-watering.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditWateringComponent extends PlantEditActionComponent {
  constructor(fb: FormBuilder, plantService: PlantService) {
    super(fb, plantService);

    this.form = this.fb.group({
      waterFreq: [],
      waterLast: [DateTime.now().toFormat('yyyy-LL-dd')],
    });
  }

  override updateForm(plant: Plant): void {
    super.updateForm(plant);

    this.form.setValue({
      waterFreq: plant.waterFreq,
      waterLast: DateTime.fromISO(plant.waterLast as string).toFormat(
        'yyyy-LL-dd',
      ),
    });
  }
}
