import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { AuthService } from '@services/auth.service';
import {
  theme as configTheme,
  availableThemes as configAvailableThemes,
} from '@config';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly auth = inject(AuthService);

  theme$ = new BehaviorSubject<string | null>(null);
  availableThemes: string[] = configAvailableThemes;

  /**
   * Defines the theme to use.
   * First it checks in user prefs, then in the config file, and if it all
   * fails then it tries to get the first one in availableThemes.
   * If everything fails, it sets an empty theme.
   */
  init() {
    let newTheme: string;
    const storedTheme = this.auth.getPref('theme');

    if (storedTheme && this.availableThemes.includes(storedTheme)) {
      newTheme = storedTheme;
    } else if (this.availableThemes.includes(configTheme)) {
      newTheme = configTheme;
    } else if (this.availableThemes.length > 0) {
      newTheme = this.availableThemes[0];
    } else newTheme = '';

    this.theme$.next(newTheme);
  }

  getTheme(): string | null {
    return this.theme$.getValue();
  }

  switchTheme(newTheme: string): Observable<any> {
    if (this.availableThemes.includes(newTheme)) {
      this.theme$.next(newTheme);

      return this.auth.setPref({ theme: newTheme });
    } else return of(null);
  }

  getAvailableThemes(): string[] {
    return this.availableThemes;
  }
}
