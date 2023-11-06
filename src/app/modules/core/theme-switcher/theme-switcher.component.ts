/**
 * The component works as if only light/dark themes are available,
 * even though ThemeService may have more themes.
 * For LittleTerrarium as it's now, we don't care.
 */

import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'lt-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {

  constructor(public theme: ThemeService) { }

  ngOnInit(): void {
  }

  switchTheme(): void {
    if (this.theme.getTheme() === 'light') this.theme.switchTheme('dark');
    else this.theme.switchTheme('light');
  }

}
