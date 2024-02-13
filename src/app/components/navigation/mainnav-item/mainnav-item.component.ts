import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  Input,
  Optional,
  Output,
  booleanAttribute,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainnavItemComponent extends MainnavBaseContentComponent {
  @Input() routerLink: any;
  @Input({ transform: booleanAttribute }) center: boolean = false;
  @Output() click: EventEmitter<void> = new EventEmitter();

  constructor(@Optional() @Host() public readonly routerLinkS: RouterLink) {
    super();
  }

  handleClick() {
    this.click.emit();
  }
}
