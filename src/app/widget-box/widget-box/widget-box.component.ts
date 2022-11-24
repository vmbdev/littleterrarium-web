import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'widget-box',
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss']
})
export class WidgetBoxComponent implements OnInit {
  @Input() image?: string;
  @Input() title?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
