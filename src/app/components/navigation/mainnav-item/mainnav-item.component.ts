import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Host, Input, Optional, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

import { MainnavBaseContentComponent } from '@components/navigation/mainnav-base-content/mainnav-base-content.component';

@Component({
  selector: 'lt-mainnav-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mainnav-item.component.html',
  styleUrl: './mainnav-item.component.scss',
  providers: [
    {
      provide: MainnavBaseContentComponent,
      useExisting: MainnavItemComponent,
    },
  ],
})
export class MainnavItemComponent extends MainnavBaseContentComponent {
  @Input() routerLink: any;
  @Output() click: EventEmitter<void> = new EventEmitter();

  constructor(@Optional() @Host() public readonly routerLinkS: RouterLink) {
    super();
  }

  handleClick() {
    this.click.emit();
  }
}
