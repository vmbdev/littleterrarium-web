import { Component, OnInit } from '@angular/core';
import { Plant } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Plant[] = [];
  
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getTasks().subscribe((data: Plant[]) => {
      this.tasks = data;
    });
  }

  getPlantName(plant: Plant): string {
    let title: string;

    if (plant.customName) title = plant.customName;
    else if (plant.specie) title = plant.specie.name;
    else title = `Plant ${plant.id}`;

    return title;
  }

}
