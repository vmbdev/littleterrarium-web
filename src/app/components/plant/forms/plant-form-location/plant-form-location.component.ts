import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'lt-plant-form-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './plant-form-location.component.html',
  styleUrl: './plant-form-location.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormLocationComponent {
  private readonly locationService = inject(LocationService);

  protected locations$ = this.locationService.getMany();
}
