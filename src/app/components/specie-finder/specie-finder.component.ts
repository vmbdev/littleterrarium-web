import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '@pipes/highlight/highlight.pipe';
import { ApiService } from '@services/api.service';
import { Specie } from '@models/specie.model';

@Component({
  standalone: true,
  selector: 'lt-specie-finder',
  imports: [
    CommonModule,
    FormsModule,
    HighlightPipe
  ],
  templateUrl: './specie-finder.component.html',
  styleUrls: ['./specie-finder.component.scss']
})
export class SpecieFinderComponent {
  @Input() selected?: number;
  @Output() selectSpecieId = new EventEmitter<number | null>();
  results: Specie[] = [];
  currentSearch: string = '';
  inputValue: string = '';
  resultsHidden: boolean = false;

  constructor(
    private api: ApiService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const specie = changes['selected'].currentValue;

    if (specie) {
      this.api.getSpecie(specie).subscribe((specie: Specie) => {
        this.selectSpecie(specie.id, specie.name);
      });
    }
  }

  keyPress(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.currentSearch = input.value;

    if (this.currentSearch.length >= 3) {
      // TODO: possibly have this as an async pipe?
      this.api.findSpecie(this.currentSearch).subscribe({
        next: (data: Specie[]) => {
          this.results = data;
        }
      })
    }
    else if (this.currentSearch.length === 0) {
      this.results = [];
    }
  }

  hideResults(): void {
    this.resultsHidden = true;
  }

  showResults(): void {
    this.resultsHidden = false;
  }

  clearSearch(): void {
    this.results = [];
    this.inputValue = '';
    this.currentSearch = '';
    this.selectSpecieId.emit(null);
  }

  selectSpecie(id: number, name: string): void {
    this.selectSpecieId.emit(id);
    this.inputValue = name;
    this.hideResults();
  }

}
