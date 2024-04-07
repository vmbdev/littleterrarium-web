import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-plant-form-name',
  standalone: true,
  imports: [ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './plant-form-name.component.html',
  styleUrl: './plant-form-name.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormNameComponent {}
