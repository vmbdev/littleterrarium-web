import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@modules/core/core.module';

@Component({
  standalone: true,
  selector: 'default-layout',
  imports: [
    RouterModule,
    CoreModule
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
