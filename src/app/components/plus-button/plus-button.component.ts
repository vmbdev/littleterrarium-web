import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lt-plus-button',
  imports: [CommonModule],
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.scss']
})
export class PlusButtonComponent {
  @Output() click: EventEmitter<null> = new EventEmitter<null>();
  @Input() title: string = '';

  clickEvent(event: MouseEvent): void {
    event.stopPropagation();
    this.click.emit();
  }

}
