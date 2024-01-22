import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';

import { PlantEditActionComponent } from '@components/plant/editing/plant-edit-action/plant-edit-action.component';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit-fertilizer',
  imports: [ReactiveFormsModule],
  templateUrl: './plant-edit-fertilizer.component.html',
  styleUrls: ['./plant-edit-fertilizer.component.scss'],
})
export class PlantEditFertilizerComponent extends PlantEditActionComponent {
  constructor(fb: FormBuilder, plantService: PlantService) {
    super(fb, plantService);

    this.form = this.fb.group({
      fertFreq: [],
      fertLast: [DateTime.now().toFormat('yyyy-LL-dd')],
      fertType: [''],
    });
  }

  override updateForm(plant: Plant): void {
    super.updateForm(plant);

    this.form.setValue({
      fertFreq: plant.fertFreq,
      fertLast: DateTime.fromISO(plant.fertLast as string).toFormat(
        'yyyy-LL-dd',
      ),
      fertType: plant.fertType,
    });
  }
}
