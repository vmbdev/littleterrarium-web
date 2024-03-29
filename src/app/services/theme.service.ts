import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  theme as configTheme,
  availableThemes as configAvailableThemes,
} from '@config';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme$: BehaviorSubject<string>;
  availableThemes: string[] = configAvailableThemes;

  /**
   * Defines the theme to use.
   * First it checks in localStorage, then in the config file, and if it all
   * fails then it tries to get the first one in availableThemes.
   * If everything fails, it sets an empty theme.
   */
  constructor() {
    let newTheme: string;
    const storedTheme = localStorage.getItem('LT_theme');

    if (storedTheme && this.availableThemes.includes(storedTheme)) {
      newTheme = storedTheme;
    } else if (this.availableThemes.includes(configTheme)) {
      newTheme = configTheme;
    } else if (this.availableThemes.length > 0) {
      newTheme = this.availableThemes[0];
    } else newTheme = '';

    this.theme$ = new BehaviorSubject<string>(newTheme);
  }

  getTheme(): string {
    return this.theme$.getValue();
  }

  switchTheme(newTheme: string): void {
    if (this.availableThemes.includes(newTheme)) {
      this.theme$.next(newTheme);

      localStorage.setItem('LT_theme', newTheme);
    }
  }

  getAvailableThemes(): string[] {
    return this.availableThemes;
  }
}
