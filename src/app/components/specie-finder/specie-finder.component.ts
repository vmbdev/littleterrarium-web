import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '@pipes/highlight/highlight.pipe';
import { ApiService } from '@services/api.service';
import { Specie } from '@models/specie.model';

@Component({
  standalone: true,
  selector: 'specie-finder',
  imports: [
    CommonModule,
    FormsModule,
    HighlightPipe
  ],
  templateUrl: './specie-finder.component.html',
  styleUrls: ['./specie-finder.component.scss']
})
export class SpecieFinderComponent implements OnInit {
  @Input() selected?: number;
  @Output() selectSpecieId = new EventEmitter<number | null>();
  results: Specie[] = [];
  currentSearch: string = '';
  inputValue: string = '';
  resultsHidden: boolean = false;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selected'].currentValue) {
      this.api.getSpecie(changes['selected'].currentValue).subscribe((specie: Specie) => {
        this.selectSpecie(specie.id, specie.name);
      });
    }
  }

  keyPress(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.currentSearch = input.value;

    if (this.currentSearch.length >= 3) {
      this.api.findSpecie(this.currentSearch).subscribe({
        next: (data: Specie[]) => {
          this.results = data;
        }
      })
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
