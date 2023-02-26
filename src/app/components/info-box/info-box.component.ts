import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// TODO: separate InfoBox properties

@Component({
  standalone: true,
  selector: 'info-box',
  imports: [CommonModule],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  @Input() image?: string;
  @Input() title?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
