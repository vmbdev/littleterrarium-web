import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { SharedModule } from '../shared/shared.module';
import { PlantServiceModule } from '../plant-service/plant-service.module';



@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlantServiceModule
  ]
})
export class TasksModule { }
