import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';

/**
 * Provides the home page for the default route.
 */
@Component({
  standalone: true,
  selector: 'lt-home',
  imports: [CommonModule, LocationListComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
