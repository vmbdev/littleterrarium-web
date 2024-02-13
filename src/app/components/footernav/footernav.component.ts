import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-footernav',
  standalone: true,
  imports: [BoxIconComponent],
  templateUrl: './footernav.component.html',
  styleUrls: ['./footernav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooternavComponent {
  @Input({ transform: booleanAttribute }) short: boolean = false;
}
