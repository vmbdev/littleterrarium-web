import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@modules/core/core.module';
import { ErrorToastComponent } from '@components/error-toast/error-toast.component';

@Component({
  standalone: true,
  selector: 'default-layout',
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    ErrorToastComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
