import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { ValidatedFormControlComponent } from '@components/validated-form-control/validated-form-control.component';

@Component({
  selector: 'lt-user-form-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './user-form-email.component.html',
  styleUrl: './user-form-email.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormEmailComponent extends ValidatedFormControlComponent {
  constructor() {
    super();

    this.control = 'email';
  }

  override ngAfterViewInit() {
    this.rootFormGroup.control
      .get('email')
      ?.addValidators(Validators.pattern(/^\S+@\S+\.\S+$/i));

    super.ngAfterViewInit();
  }
}
