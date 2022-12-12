import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Plant } from 'src/app/interfaces';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant-edit-fertilizer',
  templateUrl: './plant-edit-fertilizer.component.html',
  styleUrls: ['./plant-edit-fertilizer.component.scss']
})
export class PlantEditFertilizerComponent implements OnInit {
  // TODO: use PlantService rather than inputs
  @Input() plantId!: number;
  @Input() fertFreq?: number | null;
  @Input() fertLast?: any;
  @Input() fertType?: string | null;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();
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
    this.fertForm.setValue({
      fertFreq: this.fertFreq,
      fertLast: dayjs(this.fertLast).format('YYYY-MM-DD'),
      fertType: this.fertType
    })
  }

  submit(): void {
    const plant: Plant = this.fertForm.value;
    plant.id = this.plantId;
    
    this.plantService.update(plant).subscribe(() => {
      this.updated.emit();
    });
  }
}
