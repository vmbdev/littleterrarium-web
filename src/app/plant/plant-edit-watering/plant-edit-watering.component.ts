import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Plant } from 'src/app/interfaces';
import { PlantService } from '../../plant-service/plant.service';

@Component({
  selector: 'plant-edit-watering',
  templateUrl: './plant-edit-watering.component.html',
  styleUrls: ['./plant-edit-watering.component.scss']
})
export class PlantEditWateringComponent implements OnInit {
  @Input() plantId?: number; // it can receive a specific plantId rather than get what's in PlantService
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
      this.plantService.get(this.plantId).subscribe((plant: Plant) => { this.updateForm(plant) });
    }
    else {
      const plant = this.plantService.plant$.getValue();

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
