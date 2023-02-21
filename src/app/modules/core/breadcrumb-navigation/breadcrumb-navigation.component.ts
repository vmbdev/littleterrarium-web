import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from '@services/breadcrumb.service';

@Component({
  selector: 'breadcrumb-navigation',
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss']
})
export class BreadcrumbNavigationComponent implements OnInit {

  constructor(
    public router: Router,
    public breadcrumb: BreadcrumbService,
  ) { }

  ngOnInit(): void {
  }

}
