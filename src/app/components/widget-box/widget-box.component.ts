import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lt-widget-box',
  imports: [CommonModule],
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss'],
})
export class WidgetBoxComponent {
  @Input() image?: string;
  @Input() title?: string;
  @Input() center: boolean = true;
}
