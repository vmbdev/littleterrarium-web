import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit-fertilizer',
  imports: [ReactiveFormsModule],
  templateUrl: './plant-edit-fertilizer.component.html',
  styleUrls: ['./plant-edit-fertilizer.component.scss']
})
export class PlantEditFertilizerComponent {
  @Input() plantId?: number;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();
  id?: number;
  fertForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public plantService: PlantService
  ) {
    this.fertForm = this.fb.group({
      fertFreq: [],
      fertLast: [dayjs().format('YYYY-MM-DD')],
      fertType: [''],
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
    this.fertForm.setValue({
      fertFreq: plant.fertFreq,
      fertLast: dayjs(plant.fertLast).format('YYYY-MM-DD'),
      fertType: plant.fertType
    })
  }

  submit(): void {
    if (this.id) {
      const plant: Plant = this.fertForm.value;

      plant.id = this.id;
      this.plantService.update(plant).subscribe(() => {
        this.updated.emit();
      });
    }
  }
}
