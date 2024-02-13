import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  standalone: true,
  selector: 'lt-content-navigator',
  imports: [RouterModule, BoxIconComponent],
  templateUrl: './content-navigator.component.html',
  styleUrls: ['./content-navigator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentNavigatorComponent {
  @Input() previousLink?: any[];
  @Input() nextLink?: any[];

  constructor(private readonly router: Router) {}

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  @HostListener('window:keydown.ArrowRight', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' && this.previousLink) {
      this.router.navigate(this.previousLink);
    } else if (event.key === 'ArrowRight' && this.nextLink) {
      this.router.navigate(this.nextLink);
    }
  }
}
