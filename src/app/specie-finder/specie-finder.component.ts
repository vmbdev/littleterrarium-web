import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Specie } from '../interfaces';
import { ApiService } from '../shared/api/api.service';

@Component({
  selector: 'specie-finder',
  templateUrl: './specie-finder.component.html',
  styleUrls: ['./specie-finder.component.scss']
})
export class SpecieFinderComponent implements OnInit {
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
