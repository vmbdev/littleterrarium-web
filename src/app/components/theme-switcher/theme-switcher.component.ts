/**
 * The component works as if only light/dark themes are available,
 * even though ThemeService may have more themes.
 * For LittleTerrarium as it's now, we don't care.
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
    if (this.theme.getTheme() === 'light') this.theme.switchTheme('dark');
    else this.theme.switchTheme('light');
  }
}
