import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { ValidatedFormControlComponent } from '@components/validated-form-control/validated-form-control.component';
import { UsernameRequirements } from '@models/user.model';

@Component({
  selector: 'lt-user-form-username',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBaseActionComponent],
  templateUrl: './user-form-username.component.html',
  styleUrl: './user-form-username.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormUsernameComponent extends ValidatedFormControlComponent {
  @Input() usernameReq: UsernameRequirements | null = null;

  constructor() {
    super();

    this.control = 'username';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usernameReq'] && this.usernameReq) {
      this.rootFormGroup.control
        .get(this.control)
        ?.addValidators([
          Validators.minLength(this.usernameReq.minLength),
          Validators.maxLength(this.usernameReq.maxLength),
        ]);
    }
  }
}
