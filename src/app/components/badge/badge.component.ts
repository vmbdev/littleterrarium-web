import { Component, Input } from '@angular/core';

@Component({
  selector: 'lt-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input({ required: true }) value!: string | number | null;
}
