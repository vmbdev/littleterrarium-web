import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '@services/api.service';
import { Plant } from '@models/plant.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = new BehaviorSubject<Plant[]>([]);
  public readonly tasks$ = this.tasks.asObservable();
  private count = new BehaviorSubject<number>(0);
  public readonly count$ = this.count.asObservable();

  constructor(private api: ApiService) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.api.getTasks().subscribe((plants: Plant[]) => {
      this.countTasks(plants);
      this.tasks.next(plants);
    });
  }

  /**
   * Each task represents a plant. The presence of waterNext or fertNext is a
   * task each.
   */
  countTasks(plants: Plant[]): void {
    let recount = 0;
    
    for (const plant of plants) {
      if (plant.waterNext) recount++;
      if (plant.fertNext) recount++;
    }

    this.count.next(recount);
  }
}
