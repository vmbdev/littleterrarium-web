import { Component, Inject, LOCALE_ID } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { filter, map, switchMap } from 'rxjs';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { FloatingListComponent } from '@components/navigation/floating-list/floating-list.component';
import { MainnavItemComponent } from '@components/navigation/mainnav-item/mainnav-item.component';
import { ApiService } from '@services/api.service';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { IntlPipe } from '@pipes/intl/intl.pipe';

type LocaleList = {
  default: string;
  locales: string[];
};

@Component({
  selector: 'lt-lang-switcher',
  standalone: true,
  imports: [
    CommonModule,
    BoxIconComponent,
    CapitalizePipe,
    FloatingListComponent,
    MainnavItemComponent,
    IntlPipe,
  ],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
})
export class LangSwitcherComponent {
  protected listVisible: boolean = false;
  protected localeList?: LocaleList;
  private currentUrl: string;

  constructor(
    @Inject(LOCALE_ID) public readonly currentLocale: string,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly location: Location,
  ) {
    this.currentUrl = location.path();
  }

  ngOnInit(): void {
    // fetch available languages from the server
    this.api
      .getLocales()
      .pipe(
        map((localesData) => {
          const storedLocale = localStorage.getItem('LT_locale');
          this.localeList = localesData;

          if (
            storedLocale &&
            storedLocale !== this.currentLocale &&
            this.localeList.locales.includes(storedLocale)
          ) {
            this.changeLocale(storedLocale);
          }
        }),
        // if there are languages available, then we observe the url changes
        // for the switcher to send you to the current url
        switchMap(() => this.router.events),
        filter((event) => event instanceof NavigationStart),
        map((event) => event as NavigationStart),
      )
      .subscribe((event: NavigationStart) => {
        this.currentUrl = event.url;
      });
  }

  toggleList() {
    this.listVisible = !this.listVisible;
  }

  changeLocale(locale: string) {
    if (this.localeList?.locales.includes(locale)) {
      localStorage.setItem('LT_locale', locale);

      const newUrl =
        (this.localeList?.default !== locale ? `/${locale}` : '') +
        this.currentUrl;

      this.navigateTo(newUrl);
    }
  }

  navigateTo(url: string) {
    window.location.href = `${window.location.protocol}//${window.location.host}${url}`;
  }
}
