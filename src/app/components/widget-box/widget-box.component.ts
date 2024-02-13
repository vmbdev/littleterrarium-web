import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  standalone: true,
  selector: 'lt-widget-box',
  imports: [CommonModule, BoxIconComponent],
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetBoxComponent {
  @Input() image?: string;
  @Input() icon?: string;
  @Input() title?: string;
  @Input({ transform: booleanAttribute }) center: boolean = true;
}
