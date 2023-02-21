import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'plus-button',
  imports: [CommonModule],
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.scss']
})
export class PlusButtonComponent implements OnInit {
  @Output() click: EventEmitter<null> = new EventEmitter<null>();
  @Input() title?: string;
  @Input() type?: string;

  constructor() { }

  ngOnInit(): void {
  }

  clickEvent(): void {
    this.click.emit();
  }

}
