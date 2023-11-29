/**
 * The component works as if only light/dark themes are available,
 * even though ThemeService may have more themes.
 * For LittleTerrarium as it's now, we don't care.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'lt-theme-switcher',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {

  constructor(public theme: ThemeService) { }

  switchTheme(): void {
    if (this.theme.getTheme() === 'light') this.theme.switchTheme('dark');
    else this.theme.switchTheme('light');
  }

}
