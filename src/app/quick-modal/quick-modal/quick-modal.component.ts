import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'quick-modal',
  templateUrl: './quick-modal.component.html',
  styleUrls: ['./quick-modal.component.scss']
})
export class QuickModalComponent implements OnInit {
  @Input() title?: string;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  propagateClose(): void {
    this.close.emit();
  }

}
