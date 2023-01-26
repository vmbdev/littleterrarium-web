import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerrariumComponent } from './terrarium/terrarium.component';
import { LocationModule } from '../location/location.module';
import { PlantModule } from '../plant/plant.module';



@NgModule({
  declarations: [
    TerrariumComponent
  ],
  imports: [
    CommonModule,
    LocationModule,
    PlantModule
  ]
})
export class TerrariumModule { }
