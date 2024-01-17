import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
  @Input() visible: boolean = false;
}
