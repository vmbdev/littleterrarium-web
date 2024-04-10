import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  inject,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';

import { PasswordRequirements } from '@models/user.model';

@Component({
  selector: 'lt-user-form-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-password.component.html',
  styleUrl: './user-form-password.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormPasswordComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: UserFormPasswordComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPasswordComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);

  @Input() requirements: PasswordRequirements | null = null;

  protected readonly form = this.fb.group(
    {
      password: ['', Validators.required],
      password2: ['', Validators.required],
    },
    {
      validators: [
        this.checkPasswordStrength.bind(this),
        this.checkPasswordsEqual,
      ],
    },
  );

  protected hidePassword: boolean = true;
  protected hidePassword2: boolean = true;
  protected nonAlphaNumChars: string = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';
  protected disabled: boolean = false;
  protected pwdValue = '';

  private onChange = (_val: string) => {};

  writeValue(val: string): void {
    this.pwdValue = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.value);
  }

  changeSecondInput(pwdInput: HTMLInputElement) {
    this.onChange(pwdInput.value);
  }

  registerOnTouched(_fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate() {
    return {
      ...this.form.errors,
      ...this.form.get('password')?.errors,
      ...this.form.get('password2')?.errors,
    };
  }

  checkPasswordStrength(group: AbstractControl): ValidationErrors | null {
    const reqs = this.requirements;

    if (reqs) {
      const value = group.get('password')?.value;
      const errorObj: ValidationErrors = {};

      if (value.length < reqs.minLength) {
        errorObj['minLength'] = true;
      }
      if (reqs.requireUppercase && !/.*([A-Z]).*/.test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (reqs.requireNumber && !/.*(\d).*/.test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        reqs.requireNonAlphanumeric &&
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
      ) {
        errorObj['missingNonAlphanumeric'] = true;
      }

      return Object.keys(errorObj).length > 0 ? errorObj : null;
    }

    return null;
  }

  checkPasswordsEqual(group: AbstractControl): ValidationErrors | null {
    const pwd1 = group.get('password')?.value;
    const pwd2 = group.get('password2')?.value;

    if (pwd1 !== pwd2) return { different: true };

    return null;
  }

  toggleHidePassword(field: number = 1): void {
    if (field === 1) this.hidePassword = !this.hidePassword;
    else if (field === 2) this.hidePassword2 = !this.hidePassword2;
  }
}
