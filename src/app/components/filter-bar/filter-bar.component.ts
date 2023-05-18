import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortColumn, SortOrder } from '@models/sort-options.model';
import { ThemeService } from '@services/theme.service';

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
  nameOrder: SortOrder = 'asc';
  dateOrder: SortOrder = 'asc';

  constructor(public themeService: ThemeService) {}

  toggleSort(column: SortColumn): void {
    let order;

    if (column === 'name') {
      if (this.nameOrder === 'asc') this.nameOrder = 'desc';
      else this.nameOrder = 'asc';

      order = this.nameOrder;
    }
    else if (column === 'date') {
      if (this.dateOrder === 'asc') this.dateOrder = 'desc';
      else this.dateOrder = 'asc';

      order = this.dateOrder;
    }
    else return;

    this.sortingChanged.emit({ column, order });
  }

  filterItems(val: string): void {
    this.filterChanged.emit(val);
  }

}
