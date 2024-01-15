import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Host, Optional, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'lt-mainnav-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './mainnav-item.component.html',
  styleUrl: './mainnav-item.component.scss'
})
export class MainnavItemComponent {
  @Output() click: EventEmitter<void> = new EventEmitter();

  constructor(
    @Optional() @Host() public routerLink: RouterLink
  ) {}
}
