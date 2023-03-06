import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CloseButtonComponent } from '@components/close-button/close-button.component';

@Component({
  standalone: true,
  selector: 'quick-modal',
  imports: [CloseButtonComponent],
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss']
})
export class QuickModalComponent implements OnInit {
  @Input() title: string = '';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  propagateClose(): void {
    this.close.emit();
  }

}
