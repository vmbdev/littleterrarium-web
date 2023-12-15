import { booleanAttribute, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PictureBoxComponent
} from '@components/picture-box/picture-box.component';
import {
  PictureDetailedComponent
} from '@components/picture-detailed/picture-detailed.component';
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
    PictureBoxComponent,
    SortPipe,
    FilterPipe,
    PictureDetailedComponent,
  ],
})
export class PictureListComponent {
  @Input({ transform: booleanAttribute }) createAddItem: boolean = false;
  @Input() addItemLink?: string | any[];
  @Input() list: PictureItem[] = [];
  @Input({ transform: booleanAttribute }) contentBelow: boolean = false;
  @Input({ transform: booleanAttribute }) detailed: boolean = false;

  getStyleClass(): string {
    if (this.detailed) return 'picture-list-detailed';
    else return 'picture-list-grid';
  }
}
