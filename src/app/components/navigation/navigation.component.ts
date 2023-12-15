import { Component, HostListener, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lt-navigation',
  imports: [RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @Input() previousLink?: any[];
  @Input() nextLink?: any[];

  constructor(private router: Router) {}

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
