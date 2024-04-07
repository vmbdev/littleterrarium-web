import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lt-form-base-action',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-base-action.component.html',
  styleUrl: './form-base-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBaseActionComponent {
  private readonly rootFormGroup = inject(FormGroupDirective);
  protected form$ = new BehaviorSubject<FormGroup | null>(null);

  ngOnInit() {
    this.form$.next(this.rootFormGroup.control);
  }
}
