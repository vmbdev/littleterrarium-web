import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Provides an information box with highlighted data.
 */
@Component({
  standalone: true,
  selector: 'lt-info-box',
  imports: [CommonModule],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent  {
  /**
   * The title of the information box. By default, an empty string.
   */
  @Input({ required: true }) title!: string;
}
