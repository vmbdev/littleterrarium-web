import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';

import {
  LangSwitcherComponent
} from '@components/headernav/lang-switcher/lang-switcher.component';
import {
  ThemeSwitcherComponent
} from '@components/headernav/theme-switcher/theme-switcher.component';
import {
  UserboxComponent
} from '@components/headernav/userbox/userbox.component';
import {
  MainnavDivisorComponent
} from '@components/headernav/mainnav-divisor/mainnav-divisor.component';
import {
  MainnavItemComponent
} from '@components/headernav/mainnav-item/mainnav-item.component';

@Component({
  selector: 'lt-mainnav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThemeSwitcherComponent,
    LangSwitcherComponent,
    UserboxComponent,
    BoxIconComponent,
    MainnavDivisorComponent,
    MainnavItemComponent,
  ],
  templateUrl: './mainnav.component.html',
  styleUrls: ['./mainnav.component.scss'],
})
export class MainnavComponent {
  /**
   * Hides the menu. As per the current style definition, it doesn't do
   * anything on full view.
   */
  hideMenu: boolean = true;

  /**
   * Toggles menu visibility
   */
  toggleMenu(): void {
    this.hideMenu = !this.hideMenu;
  }
}
