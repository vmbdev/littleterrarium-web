import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from '@services/breadcrumb.service';

@Component({
  selector: 'lt-breadcrumb-navigation',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss']
})
export class BreadcrumbNavigationComponent {

  constructor(
    public router: Router,
    public breadcrumb: BreadcrumbService,
  ) { }

}
