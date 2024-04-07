import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-location-form-name',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormBaseActionComponent,
  ],
  templateUrl: './location-form-name.component.html',
  styleUrl: './location-form-name.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormNameComponent {}
