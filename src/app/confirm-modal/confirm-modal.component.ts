import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Output() accept: EventEmitter<null> = new EventEmitter<null>();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
  }

  acceptEvent(): void {
    this.accept.emit();
  }

  cancelEvent(): void {
    this.cancel.emit();
  }

}
