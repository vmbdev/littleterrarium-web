import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortOptions } from '@models/sort-options.model';

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
  @Input() searchBar: boolean = false;
  @Input() sortByName: boolean = false;
  @Input() sortByDate: boolean = false;
  @Output() sortingChanged = new EventEmitter<any>();
  @Output() filterChanged = new EventEmitter<any>();
  nameOrder: SortOptions = 'asc';
  dateOrder: SortOptions = 'asc';

  toggleSort(field: string): void {
    let order;

    if (field === 'name') {
      if (this.nameOrder === 'asc') this.nameOrder = 'desc';
      else this.nameOrder = 'asc';

      order = this.nameOrder;
    }
    else if (field === 'date') {
      if (this.dateOrder === 'asc') this.dateOrder = 'desc';
      else this.dateOrder = 'asc';

      order = this.dateOrder;
    }
    else return;

    this.sortingChanged.emit({ field, order });
  }

  filterItems(val: string): void {
    this.filterChanged.emit(val);
  }

}
