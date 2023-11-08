import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit-watering',
  imports: [ReactiveFormsModule],
  templateUrl: './plant-edit-watering.component.html',
  styleUrls: ['./plant-edit-watering.component.scss']
})
export class PlantEditWateringComponent {
  // it can receive a specific plantId rather than get what's in PlantService
  @Input() plantId?: number;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();
  id?: number;
  waterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public plantService: PlantService,
  ) {
    this.waterForm = this.fb.group({
      waterFreq: [],
      waterLast: [dayjs().format('YYYY-MM-DD')]
    })
  }

  ngOnInit(): void {
    if (this.plantId) {
      this.plantService.get(this.plantId).subscribe((plant: Plant) => {
        this.updateForm(plant)
      });
    }
    else {
      const plant = this.plantService.current();

      if (plant) this.updateForm(plant);
    }
  }

  updateForm(plant: Plant): void {
    this.id = plant.id;
    this.waterForm.setValue({
      waterFreq: plant.waterFreq,
      waterLast: dayjs(plant.waterLast).format('YYYY-MM-DD')
    })
  }

  submit(): void {
    if (this.id) {
      const plant: Plant = this.waterForm.value;

      plant.id = this.id;
      this.plantService.update(plant).subscribe(() => {
        this.updated.emit();
      });
    }
  }
}
