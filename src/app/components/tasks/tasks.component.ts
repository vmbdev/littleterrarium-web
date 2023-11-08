import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { TaskService } from '@services/task.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lt-tasks',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tasks: Plant[] = [];
  
  constructor(
    public taskService: TaskService,
    public plantService: PlantService,
  ) { }
}
