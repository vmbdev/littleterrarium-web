import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlantService } from '@services/plant.service';
import { ApiService } from '@services/api.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'tasks',
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Plant[] = [];
  
  constructor(
    private api: ApiService,
    private plantService: PlantService
  ) { }

  ngOnInit(): void {
    this.api.getTasks().subscribe((data: Plant[]) => {
      this.tasks = data;
    });
  }

  getPlantName(plant: Plant): string {
    return this.plantService.getVisibleName(plant);
  }

}
