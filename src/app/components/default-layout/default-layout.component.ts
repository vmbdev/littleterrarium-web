import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooternavComponent } from '@components/footernav/footernav.component';
import {
  MainnavComponent
} from '@components/headernav/mainnav/mainnav.component';

/**
 * Component providing the default layout.
 */
@Component({
  standalone: true,
  selector: 'lt-default-layout',
  imports: [RouterModule, MainnavComponent, FooternavComponent],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {}
