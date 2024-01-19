import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  BreadcrumbNavigationComponent
} from '@components/breadcrumb-navigation/breadcrumb-navigation.component';
import {
  MainnavDivisorComponent
} from '@components/navigation/mainnav-divisor/mainnav-divisor.component';
import {
  MainnavItemComponent
} from '@components/navigation/mainnav-item/mainnav-item.component';
import {
  MainnavComponent
} from '@components/navigation/mainnav/mainnav.component';
import {
  ErrorToastComponent
} from '@components/error-toast/error-toast.component';
import { FooternavComponent } from '@components/footernav/footernav.component';
import {
  LangSwitcherComponent
} from '@components/lang-switcher/lang-switcher.component';
import {
  ThemeSwitcherComponent
} from '@components/theme-switcher/theme-switcher.component';
import {
  UserboxComponent
} from '@components/userbox/userbox.component';

/**
 * Component providing the default layout.
 */
@Component({
  standalone: true,
  selector: 'lt-default-layout',
  imports: [
    RouterModule,
    MainnavComponent,
    FooternavComponent,
    ErrorToastComponent,
    BreadcrumbNavigationComponent,

    ThemeSwitcherComponent,
    LangSwitcherComponent,
    UserboxComponent,
    MainnavDivisorComponent,
    MainnavItemComponent,
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {}
