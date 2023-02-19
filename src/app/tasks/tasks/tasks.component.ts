import { Component, OnInit } from '@angular/core';
import { Plant } from 'src/app/interfaces';
import { PlantService } from 'src/app/plant-service/plant.service';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'tasks',
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
