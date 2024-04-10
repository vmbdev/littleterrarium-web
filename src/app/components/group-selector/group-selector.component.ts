import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  numberAttribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

export type GroupSelectorData<T> = {
  id: T;
  asset?: string;
  name?: string;
  color?: string;
};

@Component({
  selector: 'lt-group-selector',
  standalone: true,
  imports: [CommonModule, BoxIconComponent],
  templateUrl: './group-selector.component.html',
  styleUrl: './group-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GroupSelectorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupSelectorComponent implements ControlValueAccessor {
  @Input({ required: true }) group!: GroupSelectorData<any>[];
  @Input() assetType: 'image' | 'icon' = 'image';
  @Input({ transform: numberAttribute }) columns: number = 4;

  protected selectedOption: any | null = null;
  protected disabled: boolean = false;

  private onChange = (_val: any) => {};
  private onTouched = () => {};

  writeValue(val: any): void {
    this.change(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change(val: any) {
    // deselect
    if (val === this.selectedOption) this.selectedOption = null;
    else this.selectedOption = val;

    this.onChange(this.selectedOption);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
