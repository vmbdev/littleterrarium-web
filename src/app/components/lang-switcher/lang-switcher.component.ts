import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, filter, map, startWith, tap } from 'rxjs';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { FloatingListComponent } from '@components/navigation/floating-list/floating-list.component';
import { MainnavItemComponent } from '@components/navigation/mainnav-item/mainnav-item.component';
import { AngularLocales, ApiService } from '@services/api.service';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { IntlPipe } from '@pipes/intl/intl.pipe';
import { AuthService } from '@services/auth.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  protected readonly currentLocale = inject(LOCALE_ID);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected listVisible: boolean = false;
  protected localeList$?: Observable<AngularLocales>;
  protected currentRoute$?: Observable<string>;

  ngOnInit(): void {
    // fetch available languages from the server
    this.localeList$ = this.api.getLocales().pipe(
      tap((localesData: AngularLocales) => {
        const storedLocale = this.auth.getPref('locale');

        if (
          storedLocale &&
          localesData.locales.includes(storedLocale)
        ) {
          this.changeLocale(storedLocale, localesData.default === storedLocale);
        }
      }),
    );

    this.currentRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      startWith(this.router),
      map((event) => event as NavigationStart),
      map((event: NavigationStart) => event.url),
    );
  }

  toggleList() {
    this.listVisible = !this.listVisible;
  }

  changeLocale(locale: string, baseUrl: boolean, url?: string) {
    if (locale === this.currentLocale) return;
    
    const newUrl = (baseUrl ? '' : `/${locale}`) + (url ?? '');

    this.auth.setPref({ locale }).subscribe(() => {
      this.navigateTo(newUrl);
    });
  }

  navigateTo(url: string) {
    window.location.href = `${window.location.protocol}//${window.location.host}${url}`;
  }
}
