import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  LocationListComponent
} from '@components/location/location-list/location-list.component';
import { SigninComponent } from '@components/user/signin/signin.component';
import { AuthService } from '@services/auth.service';

/**
 * Provides the home page for the default route.
 */
@Component({
  standalone: true,
  selector: 'lt-home',
  imports: [CommonModule, SigninComponent, LocationListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
