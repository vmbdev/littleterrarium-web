import { Component, Inject, LOCALE_ID } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { filter, map, switchMap } from 'rxjs';

import { ApiService } from '@services/api.service';

type LocaleList = {
  default: string,
  locales: string[]
}

@Component({
  selector: 'lt-lang-switcher',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss']
})
export class LangSwitcherComponent {
  listHidden: boolean = true;
  currentUserLocale: string | null = null;
  availableLocales?: LocaleList;
  currentUrl: string;

  constructor(
    @Inject(LOCALE_ID) public currentLocale: string,
    private router: Router,
    private api: ApiService,
    private location: Location
  ) {
    this.currentUrl = location.path();
  }

  ngOnInit(): void {
    // fetch available languages from the server
    this.api.getLocales().pipe(
      map((localesData) => {
        const storedLocale = localStorage.getItem('LT_locale');
        this.availableLocales = localesData;

        if (
          storedLocale
          && (storedLocale !== this.currentLocale)
          && this.getFullLocaleList().includes(storedLocale)
        ) {
          this.changeLocale(storedLocale);
        }
      }),
      // if there are languages available, then we observe the url changes
      // for the switcher to send you to the current url
      switchMap(() => this.router.events),
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart),
    )
    .subscribe((event: NavigationStart) => {
      this.currentUrl = event.url;
    })
  }

  toggleList() {
    this.listHidden = !this.listHidden;
  }

  changeLocale(locale: string) {
    if (this.getFullLocaleList().includes(locale)) {
      localStorage.setItem('LT_locale', locale);

      const newUrl =
        (this.availableLocales?.default !== locale ? `/${locale}` : '')
        + this.currentUrl;

      this.navigateTo(newUrl);
    }
  }

  navigateTo(url: string) {
    window.location.href =
      window.location.protocol
      + '//'
      + window.location.host + url;
  }

  getFullLocaleList(): string[] {
    if (this.availableLocales) {
      return [...this.availableLocales.locales, this.availableLocales.default];
    }
    else return [];
  }
}
