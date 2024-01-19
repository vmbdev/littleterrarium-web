import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'lt-floating-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './floating-list.component.html',
  styleUrl: './floating-list.component.scss'
})
export class FloatingListComponent {
  @Input({ transform: booleanAttribute }) visible: boolean = false;
}
