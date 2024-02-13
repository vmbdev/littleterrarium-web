import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { BreadcrumbService } from '@services/breadcrumb.service';

@Component({
  selector: 'lt-breadcrumb-navigation',
  standalone: true,
  imports: [RouterModule, CommonModule, BoxIconComponent],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbNavigationComponent {
  constructor(
    public readonly router: Router,
    public readonly breadcrumb: BreadcrumbService,
  ) {}
}
