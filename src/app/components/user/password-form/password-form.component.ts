import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { PasswordRequirements } from '@models/user.model';

@Component({
  selector: 'lt-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormComponent {
  @Input() requirements?: PasswordRequirements | null;
  @Input({ required: true }) passwordGroup!: FormGroup;
  protected nonAlphaNumChars: string = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';
  protected hasRequirements: boolean = false;

  ngOnInit(): void {
    this.passwordGroup.controls['password'].addValidators([
      Validators.required,
      this.checkPasswordStrength.bind(this),
    ]);
    this.passwordGroup.controls['password2'].addValidators(Validators.required);
    this.passwordGroup.addValidators(this.checkPasswordsEqual);
    this.passwordGroup.updateValueAndValidity();
  }

  checkPasswordStrength(pwd: AbstractControl): ValidationErrors | null {
    const value = pwd.value;
    const errorObj: ValidationErrors = {};

    if (this.requirements) {
      if (value.length < this.requirements.minLength) {
        errorObj['minLength'] = true;
      }
      if (this.requirements.requireUppercase && !/.*([A-Z]).*/.test(value)) {
        errorObj['missingUppercase'] = true;
      }
      if (this.requirements.requireNumber && !/.*(\d).*/.test(value)) {
        errorObj['missingNumber'] = true;
      }
      if (
        this.requirements.requireNonAlphanumeric &&
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
      ) {
        errorObj['missingNonAlphanumeric'] = true;
      }
    }

    return Object.keys(errorObj).length > 0 ? errorObj : null;
  }

  checkPasswordsEqual(group: AbstractControl): ValidationErrors | null {
    const pwd1 = group.get('password')?.value;
    const pwd2 = group.get('password2')?.value;

    if (pwd1 !== pwd2) return { different: true };

    return null;
  }

  hasError(error: string): boolean | undefined {
    return this.passwordGroup.get('password')?.hasError(error);
  }

  arePasswordsEqual(): boolean {
    return !this.passwordGroup.hasError('different');
  }
}
