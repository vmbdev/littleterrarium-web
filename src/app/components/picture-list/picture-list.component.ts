import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { PictureItem } from '@models/picture-item.model';
import { SortPipe } from '@pipes/sort/sort.pipe';
import { FilterPipe } from '@pipes/filter/filter.pipe';

@Component({
  standalone: true,
  selector: 'lt-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PictureBoxComponent,
    SortPipe,
    FilterPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PictureListComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureListComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);

  @Input({ transform: booleanAttribute }) createAddItem: boolean = false;
  @Input() addItemLink?: string | any[];
  @Input() list: PictureItem[] = [];
  @Input({ transform: booleanAttribute }) contentBelow: boolean = false;
  @Input({ transform: booleanAttribute }) editMode: boolean = false;

  protected checkboxes = this.fb.array([]);
  protected readonly form = this.fb.group({
    pics: this.checkboxes,
  });

  private onChange = (_val: number[]) => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list']) {
      const list = changes['list'].currentValue;
      const prev = changes['list'].previousValue?.length;
      let base;

      // new filtered list
      if (prev > list.length) {
        this.checkboxes = this.fb.array([]);
        base = 0;
      } else base = prev > 0 ? prev : 0;

      for (let i = base; i < list.length; i++) {
        this.checkboxes.push(new FormControl());
        
      }
    }
  }

  writeValue(val: number[]): void {
    for (const control of this.checkboxes.controls) {
      control.patchValue(null);
    }
    
    for (const v of val) {
      this.checkboxes.at(v).patchValue(true);
    }
    
    this.onChange(this.getSelectedOptions());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change() {
    this.onChange(this.getSelectedOptions());
  }

  registerOnTouched(_fn: any): void {}

  setDisabledState(_isDisabled: boolean): void {}

  getSelectedOptions(): number[] {
    if (this.checkboxes.value) {
      return this.checkboxes.value.reduce((res: number[], v, i) => {
        const item = this.list[i].id;
        if (v && item) res.push(item);
        return res;
      }, []);
    } else return [];
  }
}
