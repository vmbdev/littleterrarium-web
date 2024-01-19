import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Host, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lt-mainnav-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mainnav-item.component.html',
  styleUrl: './mainnav-item.component.scss',
})
export class MainnavItemComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Output() click: EventEmitter<void> = new EventEmitter();

  constructor(@Optional() @Host() public routerLink: RouterLink) {}
}
