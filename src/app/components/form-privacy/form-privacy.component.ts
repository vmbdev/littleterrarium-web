import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

@Component({
  selector: 'lt-form-privacy',
  standalone: true,
  imports: [ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './form-privacy.component.html',
  styleUrl: './form-privacy.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPrivacyComponent {}
