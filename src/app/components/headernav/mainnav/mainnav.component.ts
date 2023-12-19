import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  BreadcrumbNavigationComponent
} from '@components/breadcrumb-navigation/breadcrumb-navigation.component';
import {
  LangSwitcherComponent
} from '@components/headernav/lang-switcher/lang-switcher.component';
import {
  ThemeSwitcherComponent
} from '@components/headernav/theme-switcher/theme-switcher.component';
import {
  UserboxComponent
} from '@components/headernav/userbox/userbox.component';

@Component({
  selector: 'lt-mainnav',
  standalone: true,
  imports: [
    RouterModule,
    ThemeSwitcherComponent,
    LangSwitcherComponent,
    UserboxComponent,
    BreadcrumbNavigationComponent,
  ],
  templateUrl: './mainnav.component.html',
  styleUrls: ['./mainnav.component.scss'],
})
export class MainnavComponent {}
