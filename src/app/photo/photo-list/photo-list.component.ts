import { Component, Input, OnInit } from '@angular/core';

import { Photo } from 'src/app/interfaces';

@Component({
  selector: 'photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {
  @Input() list!: Photo[];
  @Input() plantId!: number;
  @Input() owned: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
