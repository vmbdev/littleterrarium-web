import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { SortColumn, SortOrder } from '@models/sort-options.model';

/**
 * Toolbar component providing sorting and filtering options.
 */
@Component({
  selector: 'lt-filter-bar',
  standalone: true,
  imports: [CommonModule, BoxIconComponent],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  /**
   * Show the search bar for text filtering.
   */
  @Input({ transform: booleanAttribute }) showSearchBar: boolean = false;

  /**
   * Show the option to sort the list by name.
   */
  @Input({ transform: booleanAttribute }) showSortByName: boolean = false;

  /**
   * Show the option to sort the list by date.
   */
  @Input({ transform: booleanAttribute }) showSortByDate: boolean = false;

  /**
   * Show multiple selection option.
   */
  @Input({ transform: booleanAttribute }) showMultipleSelect: boolean = false;

  @Input() nameOrder: SortOrder = 'asc';
  @Input() dateOrder: SortOrder = 'asc';
  @Input() activeColumn: SortColumn = 'name';

  /**
   * Emitted when the column or the order has changed.
   */
  @Output() sortingChanged = new EventEmitter<any>();

  /**
   * Emitted when the search bar text has changed.
   */
  @Output() filterChanged = new EventEmitter<any>();

  /**
   * Emitted when the search bar text has changed.
   */
  @Output() multipleSelectChanged = new EventEmitter<boolean>();

  protected multipleSelect: boolean = false;

  /**
   * Given a column (name, date), toggle the order between ascending and
   * descending.
   *
   * @param {SortColumn} column  The column whose order is being toggled.
   */
  toggleSort(column: SortColumn) {
    let order;

    if (column === 'name') {
      order = this.nameOrder === 'asc' ? 'desc' : 'asc';
    } else if (column === 'date') {
      order = this.dateOrder === 'asc' ? 'desc' : 'asc';
    } else return;

    this.sortingChanged.emit({ column, order });
  }

  toggleMultipleSelect() {
    this.multipleSelect = !this.multipleSelect;

    this.multipleSelectChanged.emit(this.multipleSelect);
  }

  /**
   * When the text in the search bar changes, emit the new value.
   * @param {string} val  The new value in the search bar.
   */
  filterItems(val: string): void {
    this.filterChanged.emit(val);
  }
}
