import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

/**
 * Provides an information box with highlighted data.
 */
@Component({
  standalone: true,
  selector: 'lt-info-box',
  imports: [BoxIconComponent],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBoxComponent {
  /**
   * The title of the information box. By default, an empty string.
   */
  @Input() title: string = '';
}
