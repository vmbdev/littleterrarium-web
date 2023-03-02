import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { PictureItem } from '@models/picture-item.model';
import { SortPipe } from '@pipes/sort/sort.pipe';

@Component({
  standalone: true,
  selector: 'picture-list',
  imports: [
      CommonModule,
      PictureBoxComponent,
      SortPipe
  ],
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss'],
})
export class PictureListComponent {
  @Input() createAddItem?: boolean = true;
  @Input() addItemLink?: string | any[];
  @Input() list?: PictureItem[];
  @Input() contentBelow: boolean = false;
}
