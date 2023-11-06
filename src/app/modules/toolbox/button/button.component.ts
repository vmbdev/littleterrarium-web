import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lt-toolbox-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() image?: string;
  @Output() click = new EventEmitter<any>();
  @ViewChild('buttonTemplate') buttonTemplate!: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

  clickEvent(): void {
    this.click.emit();
  }

}
