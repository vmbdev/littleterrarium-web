import { Component, EventEmitter, Input, Output, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Plant } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'lt-plant-edit-action',
  standalone: true,
  imports: [],
  templateUrl: './plant-edit-action.component.html',
  styleUrl: './plant-edit-action.component.scss'
})
export abstract class PlantEditActionComponent {
  @Input({ transform: numberAttribute }) plantId?: number;
  @Output() updated = new EventEmitter<any>();
  protected id?: number;
  protected form!: FormGroup;

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

  today(): string {
    return DateTime.now().toFormat('yyyy-LL-dd');
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
