import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, skipWhile, tap } from 'rxjs';

@Component({
  selector: 'lt-validated-form-control',
  standalone: true,
  imports: [],
  templateUrl: './validated-form-control.component.html',
  styleUrl: './validated-form-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatedFormControlComponent {
  protected readonly rootFormGroup = inject(FormGroupDirective);
  private readonly destroyRef = inject(DestroyRef);

  protected errorTaken$ = new BehaviorSubject(false);
  protected errorInvalid$ = new BehaviorSubject(false);

  protected control: string = '';

  ngAfterViewInit() {
    this.rootFormGroup.control.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        skipWhile((status) => status === 'VALID'),
        tap(() => {
          this.errorInvalid$.next(
            this.checkFormErrors(this.control, 'invalid'),
          );
          this.errorTaken$.next(this.checkFormErrors(this.control, 'taken'));
        }),
      )
      .subscribe();
  }

  checkFormErrors(control: string, error: string): boolean {
    if (this.rootFormGroup.control) {
      const errors = this.rootFormGroup.control.get(control)?.errors;
      return errors && errors[error];
    }

    return false;
  }
}
