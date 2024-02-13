import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ThemeService } from '@services/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('mainElement') mainElement!: TemplateRef<any>;
  private currentTheme?: string;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    public readonly theme: ThemeService,
  ) {
    this.theme.theme$
      .pipe(takeUntilDestroyed())
      .subscribe((newTheme: string) => {
        if (this.currentTheme) {
          this.renderer.removeClass(
            this.document.body,
            `theme-${this.currentTheme}`,
          );
        }

        this.renderer.addClass(this.document.body, `theme-${newTheme}`);

        this.currentTheme = newTheme;
      });
  }
}
