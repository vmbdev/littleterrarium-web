import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'picturebox',
  templateUrl: './picture-box.component.html',
  styleUrls: ['./picture-box.component.scss'],
  preserveWhitespaces: true,
})
export class PictureBoxComponent implements OnInit {
  @Input() image?: string | null;
  @Input() contentBelow: boolean = false;
  @Input() add: boolean = false;
  @Input() link?: string | any[];

  constructor() { }

  ngOnInit(): void {
  }

}
