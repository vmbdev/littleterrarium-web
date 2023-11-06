import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lt-widget-box',
  imports: [CommonModule],
  templateUrl: './widget-box.component.html',
  styleUrls: ['./widget-box.component.scss']
})
export class WidgetBoxComponent implements OnInit {
  @Input() image?: string;
  @Input() title?: string;
  @Input() center: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
