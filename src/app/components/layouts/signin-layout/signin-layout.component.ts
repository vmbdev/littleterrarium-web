import { Component } from '@angular/core';

import { SigninComponent } from '@components/user/signin/signin.component';
import { LangSwitcherComponent } from "@components/lang-switcher/lang-switcher.component";
import { ThemeSwitcherComponent } from "@components/theme-switcher/theme-switcher.component";
import { FooternavComponent } from '@components/footernav/footernav.component';

@Component({
  selector: 'lt-signin-layout',
  standalone: true,
  templateUrl: './signin-layout.component.html',
  styleUrl: './signin-layout.component.scss',
  imports: [
    SigninComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    FooternavComponent
  ]
})
export class SigninLayoutComponent {}