import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  @Input() image?: string;
  @Input() title?: string;
  @Input() vertical: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
