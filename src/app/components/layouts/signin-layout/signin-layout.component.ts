import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SigninComponent } from '@components/user/signin/signin.component';
import { LangSwitcherComponent } from '@components/lang-switcher/lang-switcher.component';
import { ThemeSwitcherComponent } from '@components/theme-switcher/theme-switcher.component';
import { FooternavComponent } from '@components/footernav/footernav.component';
import { ErrorToastComponent } from '@components/error-toast/error-toast.component';

@Component({
  selector: 'lt-signin-layout',
  standalone: true,
  templateUrl: './signin-layout.component.html',
  styleUrl: './signin-layout.component.scss',
  imports: [
    SigninComponent,
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    FooternavComponent,
    ErrorToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninLayoutComponent {}