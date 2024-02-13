import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  booleanAttribute,
} from '@angular/core';

import { MainnavBaseContentComponent } from '@components/navigation/mainnav-base-content/mainnav-base-content.component';

@Component({
  selector: 'lt-floating-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-list.component.html',
  styleUrl: './floating-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingListComponent {
  @ContentChildren(MainnavBaseContentComponent)
  content!: QueryList<MainnavBaseContentComponent>;

  @Input({ transform: booleanAttribute }) visible: boolean = false;
}
