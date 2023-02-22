import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PictureBoxComponent } from '@components/picture-box/picture-box.component';
import { Photo } from '@models/photo.model';

@Component({
  standalone: true,
  selector: 'photo-list',
  imports: [
    CommonModule,
    PictureBoxComponent
  ],
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
