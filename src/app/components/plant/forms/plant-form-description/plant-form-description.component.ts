import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-plant-form-description',
  standalone: true,
  imports: [ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './plant-form-description.component.html',
  styleUrl: './plant-form-description.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormDescriptionComponent {}
