import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';

import {
  DefaultLayoutComponent
} from '@components/default-layout/default-layout.component';
import { ThemeService } from '@services/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, DefaultLayoutComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('mainElement') mainElement!: TemplateRef<any>;

  constructor(public theme: ThemeService) {}
}
