import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Observable, skipWhile, switchMap, tap } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ThemeService } from '@services/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);

  @ViewChild('mainElement') mainElement!: TemplateRef<any>;

  private currentTheme?: string;
  protected settings$?: Observable<any>

  ngOnInit() {
    this.settings$ = this.auth
      .check()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.auth.signedIn$),
        switchMap(() => {
          this.theme.init();

          return this.theme.theme$;
        }),
        skipWhile((newTheme) => !newTheme),
        tap((newTheme: string | null) => {
          if (newTheme) {
            if (this.currentTheme) {
              this.renderer.removeClass(
                this.document.body,
                `theme-${this.currentTheme}`,
              );
            }
  
            this.renderer.addClass(this.document.body, `theme-${newTheme}`);
            this.currentTheme = newTheme;
          }
        })
      )
  }
}
