import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-mainnav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoxIconComponent,
  ],
  templateUrl: './mainnav.component.html',
  styleUrls: ['./mainnav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainnavComponent {
  /**
   * Path (absolute or relative) of the brand image.
   */
  @Input() brand?: string;

  /**
   * Whether to have the left side of the nav (brand and hamburger)
   */
  @Input({ transform: booleanAttribute }) leftSide: boolean = true;

  /**
   * Whether the navbar should display as a column in small devices.
   * When it's very small (i.e. a couple of BoxIcons) it's useful to set it
   * false.
   */
  @Input({ transform: booleanAttribute }) noColumn: boolean = false;

  /**
   * Hides the menu. As per the current style definition, it doesn't do
   * anything on full view.
   */
  hideMenu: boolean = this.leftSide;

  /**
   * Toggles menu visibility
   */
  toggleMenu(): void {
    this.hideMenu = !this.hideMenu;
  }
}
