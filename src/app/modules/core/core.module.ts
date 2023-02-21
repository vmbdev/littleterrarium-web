import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainnavComponent } from './mainnav/mainnav.component';
import { RouterModule } from '@angular/router';
import { UserboxComponent } from './userbox/userbox.component';
import { BreadcrumbNavigationComponent } from './breadcrumb-navigation/breadcrumb-navigation.component';
import { FooternavComponent } from './footernav/footernav.component';
import { LangSwitcherComponent } from './lang-switcher/lang-switcher.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

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
  ],
  exports: [
    MainnavComponent,
    FooternavComponent
  ]
})
export class CoreModule { }
