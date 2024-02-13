import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-property-public',
  standalone: true,
  imports: [BoxIconComponent],
  templateUrl: './property-public.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyPublicComponent {
  @Input({ transform: booleanAttribute }) public: boolean = true;
}
