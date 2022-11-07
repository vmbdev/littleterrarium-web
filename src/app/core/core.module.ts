import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainnavComponent } from './mainnav/mainnav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserboxComponent } from './userbox/userbox.component';
import { BreadcrumbNavigationComponent } from './breadcrumb-navigation/breadcrumb-navigation.component';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { FooternavComponent } from './footernav/footernav.component';
import { LangSwitcherComponent } from './lang-switcher/lang-switcher.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { ThemeService } from './theme.service';

@NgModule({
  declarations: [
    MainnavComponent,
    UserboxComponent,
    BreadcrumbNavigationComponent,
    FooternavComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BreadcrumbModule
  ],
  providers: [
    ThemeService
  ],
  exports: [
    MainnavComponent,
    FooternavComponent
  ]
})
export class CoreModule { }
