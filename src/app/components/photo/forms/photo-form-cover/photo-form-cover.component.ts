import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-photo-form-cover',
  standalone: true,
  imports: [ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './photo-form-cover.component.html',
  styleUrl: './photo-form-cover.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormCoverComponent {}
