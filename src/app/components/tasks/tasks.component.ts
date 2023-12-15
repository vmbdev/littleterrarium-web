import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlantService } from '@services/plant.service';
import { TaskService } from '@services/task.service';
import { ModalService } from '@services/modal.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-tasks',
  imports: [CommonModule, RouterModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  @ViewChild('fertModal') fertModal!: TemplateRef<any>;
  @ViewChild('waterModal') waterModal!: TemplateRef<any>;

  tasks: Plant[] = [];

  constructor(
    public taskService: TaskService,
    public plantService: PlantService,
    private modal: ModalService
  ) {}

  openFertModal(id: number): void {
    this.modal.open(this.fertModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.addFertilizer(id);
    });
  }

  addFertilizer(id: number): void {
    this.plantService.fertilize(id).subscribe(() => {
      this.taskService.loadTasks();
    });
  }

  openWaterModal(id: number): void {
    this.modal.open(this.waterModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.addWater(id);
    });
  }

  addWater(id: number): void {
    this.plantService.water(id).subscribe(() => {
      this.taskService.loadTasks();
    });
  }
}
