import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortColumn, SortOrder } from '@models/sort-options.model';
import { ThemeService } from '@services/theme.service';

/**
 * Toolbar component providing sorting and filtering options.
 */
@Component({
  selector: 'lt-filter-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
  /**
   * Show the search bar for text filtering.
   */
  @Input() searchBar: boolean = false;

  /**
   * Show the option to sort the list by name.
   */
  @Input() sortByName: boolean = false;

  /**
   * Show the option to sort the list by date.
   */
  @Input() sortByDate: boolean = false;

  /**
   * Emitted when the column or the order has changed.
   */
  @Output() sortingChanged = new EventEmitter<any>();

  /**
   * Emitted when the search bar text has changed.
   */
  @Output() filterChanged = new EventEmitter<any>();

  nameOrder: SortOrder = 'asc';
  dateOrder: SortOrder = 'asc';

  constructor(public themeService: ThemeService) {}

  /**
   * Given a column (name, date), toggle the order between ascending and
   * descending.
   * 
   * @param {SortColumn} column  The column whose order is being toggled.
   */
  toggleSort(column: SortColumn) {
    let order;

    switch (column) {
      case 'name': {
        if (this.nameOrder === 'asc') this.nameOrder = 'desc';
        else this.nameOrder = 'asc';

        order = this.nameOrder;

        break;
      }
      case 'date': {
        if (this.dateOrder === 'asc') this.dateOrder = 'desc';
        else this.dateOrder = 'asc';

        order = this.dateOrder;

        break;
      }
      default: {
        return;
      }
    }

    this.sortingChanged.emit({ column, order });
  }

  /**
   * When the text in the search bar changes, emit the new value.
   * @param {string} val  The new value in the search bar.
   */
  filterItems(val: string): void {
    this.filterChanged.emit(val);
  }

}
