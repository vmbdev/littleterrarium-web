import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { PictureItem } from '@models/picture-item.model';
import { SortPipe } from '@pipes/sort/sort.pipe';
import { FilterPipe } from "@pipes/filter/filter.pipe";
import { SortOptions } from '@models/sort-options.model';

@Component({
    standalone: true,
    selector: 'picture-list',
    templateUrl: './picture-list.component.html',
    styleUrls: ['./picture-list.component.scss'],
    imports: [
        CommonModule,
        PictureBoxComponent,
        SortPipe,
        FilterPipe
    ]
})
export class PictureListComponent {
  @Input() createAddItem?: boolean = true;
  @Input() addItemLink?: string | any[];
  @Input() list: PictureItem[] = [];
  @Input() contentBelow: boolean = false;
  @Input() sortOrder: SortOptions = 'asc';
  @Input() sortBy: string = 'name';
  @Input() filterText?: string;
}
