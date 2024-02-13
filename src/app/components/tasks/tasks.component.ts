import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { PlantService } from '@services/plant.service';
import { TaskService } from '@services/task.service';
import { ModalService } from '@services/modal.service';

@Component({
  standalone: true,
  selector: 'lt-tasks',
  imports: [CommonModule, RouterModule, BoxIconComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  @ViewChild('fertModal') fertModal!: TemplateRef<any>;
  @ViewChild('waterModal') waterModal!: TemplateRef<any>;

  constructor(
    public readonly taskService: TaskService,
    public readonly plantService: PlantService,
    private readonly modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

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
