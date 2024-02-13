import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  numberAttribute,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';

import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  selector: 'lt-plant-edit-action',
  standalone: true,
  imports: [],
  templateUrl: './plant-edit-action.component.html',
  styleUrl: './plant-edit-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class PlantEditActionComponent {
  @Input({ transform: numberAttribute }) plantId?: number;
  @Output() updated = new EventEmitter<any>();
  protected id?: number;
  protected form!: FormGroup;
  protected today = DateTime.now().toFormat('yyyy-LL-dd');

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly plantService: PlantService,
  ) {}

  ngOnInit(): void {
    if (this.plantId) {
      this.plantService.get(this.plantId).subscribe((plant: Plant) => {
        this.updateForm(plant);
      });
    } else {
      const plant = this.plantService.current();

      if (plant) this.updateForm(plant);
    }
  }

  updateForm(plant: Plant): void {
    this.id = plant.id;
  }

  submit(): void {
    if (this.id) {
      const plant: Plant = this.form.value;

      plant.id = this.id;
      this.plantService.update(plant).subscribe(() => {
        this.updated.emit();
      });
    }
  }
}
