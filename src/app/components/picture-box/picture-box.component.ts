import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lt-picture-box',
  imports: [CommonModule, RouterModule],
  templateUrl: './picture-box.component.html',
  styleUrls: ['./picture-box.component.scss'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureBoxComponent {
  @Input() image?: string | null;
  @Input({ transform: booleanAttribute }) contentBelow: boolean = false;
  @Input({ transform: booleanAttribute }) add: boolean = false;
  @Input() link?: string | any[];
}
