import { booleanAttribute, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lt-picture-detailed',
  imports: [CommonModule, RouterModule],
  templateUrl: './picture-detailed.component.html',
  styleUrls: ['./picture-detailed.component.scss'],
})
export class PictureDetailedComponent {
  @Input() image?: string | null;
  @Input({ transform: booleanAttribute }) add: boolean = false;
  @Input() link?: string | any[];
}
