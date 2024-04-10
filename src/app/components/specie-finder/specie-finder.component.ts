import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { ApiService } from '@services/api.service';
import { Specie } from '@models/specie.model';
import { HighlightPipe } from '@pipes/highlight/highlight.pipe';

@Component({
  selector: 'lt-specie-finder',
  standalone: true,
  imports: [CommonModule, BoxIconComponent, HighlightPipe],
  templateUrl: './specie-finder.component.html',
  styleUrls: ['./specie-finder.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpecieFinderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecieFinderComponent  {
  private readonly api = inject(ApiService);

  protected specieName$?: Observable<string>;
  protected results$?: Observable<Specie[]>;
  protected currentSearch: string = '';
  protected resultsHidden: boolean = false;
  protected disabled: boolean = false;

  private onChange = (_val: number | null) => {};

  writeValue(val: number | null): void {
    if (val) {
      this.specieName$ = this.api.getSpecie(val).pipe(
        map((specie: Specie) => specie.name),
      );
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  change(val: string) {
    this.currentSearch = val;

    if (val.length >= 3) {
      this.results$ = this.api.findSpecie(val);
    } else if (val.length === 0) {
      this.onChange(null);
      this.results$ = undefined;
    }
  }

  registerOnTouched(_fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  hideResults(): void {
    this.resultsHidden = true;
  }

  showResults(): void {
    this.resultsHidden = false;
  }

  clear(): void {
    this.onChange(null);
    this.specieName$ = of('');
    this.results$ = undefined;
    this.currentSearch = '';
  }

  selectSpecie(id: number, name: string): void {
    this.onChange(id);
    this.specieName$ = of(name);
    this.hideResults();
  }
}
