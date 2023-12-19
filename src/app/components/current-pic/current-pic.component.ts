import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lt-current-pic',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './current-pic.component.html',
  styleUrl: './current-pic.component.scss',
})
export class CurrentPicComponent {
  @Input({ required: true }) pic?: string | null;
  @Output() toggleRemove = new EventEmitter<boolean>(false);

  toggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleRemove.emit(checkbox.checked);
  }
}
