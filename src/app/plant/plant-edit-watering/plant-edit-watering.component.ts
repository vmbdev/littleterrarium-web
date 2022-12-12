import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Plant } from 'src/app/interfaces';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant-edit-watering',
  templateUrl: './plant-edit-watering.component.html',
  styleUrls: ['./plant-edit-watering.component.scss']
})
export class PlantEditWateringComponent implements OnInit {
  // TODO: use PlantService rather than inputs
  @Input() plantId!: number;
  @Input() waterFreq?: number | null;
  @Input() waterLast?: any;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();
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
    this.waterForm.setValue({
      waterFreq: this.waterFreq,
      waterLast: dayjs(this.waterLast).format('YYYY-MM-DD')
    })
  }

  submit(): void {
    const plant: Plant = this.waterForm.value;
    plant.id = this.plantId;
    
    this.plantService.update(plant).subscribe(() => {
      this.updated.emit();
    });
  }
}
