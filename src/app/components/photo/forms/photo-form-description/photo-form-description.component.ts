import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-photo-form-description',
  standalone: true,
  imports: [ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './photo-form-description.component.html',
  styleUrl: './photo-form-description.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormDescriptionComponent {}
