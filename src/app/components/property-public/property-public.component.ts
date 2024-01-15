import { Component, Input, booleanAttribute } from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-property-public',
  standalone: true,
  imports: [BoxIconComponent],
  templateUrl: './property-public.component.html'
})
export class PropertyPublicComponent {
  @Input({ transform: booleanAttribute }) public: boolean = true;
}
