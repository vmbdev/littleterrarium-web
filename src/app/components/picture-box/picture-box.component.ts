import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lt-picture-box',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './picture-box.component.html',
  styleUrls: ['./picture-box.component.scss'],
  preserveWhitespaces: true,
})
export class PictureBoxComponent {
  @Input() image?: string | null;
  @Input() contentBelow: boolean = false;
  @Input() add: boolean = false;
  @Input() link?: string | any[];
}
