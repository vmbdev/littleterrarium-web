import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { ApiService } from '@services/api.service';
import { Specie } from '@models/specie.model';
import { HighlightPipe } from '@pipes/highlight/highlight.pipe';

@Component({
  standalone: true,
  selector: 'lt-specie-finder',
  imports: [CommonModule, BoxIconComponent, FormsModule, HighlightPipe],
  templateUrl: './specie-finder.component.html',
  styleUrls: ['./specie-finder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecieFinderComponent {
  @Input() selected?: number;
  @Output() selectSpecieId = new EventEmitter<number | null>();
  protected results$: Observable<Specie[]> = of([]);
  protected currentSearch: string = '';
  protected specieName$?: Observable<string>;
  protected resultsHidden: boolean = false;

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    if (this.selected) {
      this.specieName$ = this.api
        .getSpecie(this.selected)
        .pipe(map((specie: Specie) => specie.name));
    }
  }

  keyPress(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.currentSearch = input.value;

    if (this.currentSearch.length >= 3) {
      this.results$ = this.api.findSpecie(this.currentSearch);
    } else if (this.currentSearch.length === 0) {
      this.results$ = of([]);
    }
  }

  hideResults(): void {
    this.resultsHidden = true;
  }

  showResults(): void {
    this.resultsHidden = false;
  }

  clearSearch(): void {
    this.results$ = of([]);
    this.specieName$ = of('');
    this.currentSearch = '';
    this.selectSpecieId.emit(null);
  }

  selectSpecie(id: number, name: string): void {
    this.selectSpecieId.emit(id);
    this.specieName$ = of(name);
    this.hideResults();
  }
}
