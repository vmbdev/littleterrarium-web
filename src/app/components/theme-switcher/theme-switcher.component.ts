/**
 * The component works as if only light/dark themes are available,
 * even though ThemeService may have more themes.
 * For LittleTerrarium as it is now, we don't care.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'lt-theme-switcher',
  standalone: true,
  imports: [CommonModule, BoxIconComponent],
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  constructor(protected readonly theme: ThemeService) {}

  switchTheme(): void {
    let newTheme;

    if (this.theme.getTheme() === 'light') newTheme = 'dark';
    else newTheme = 'light';

    this.theme.switchTheme(newTheme).subscribe();
  }
}
