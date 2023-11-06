import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lt-property-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-box.component.html',
  styleUrls: ['./property-box.component.scss']
})
export class PropertyBoxComponent {
  @Input() icon?: string;
}
