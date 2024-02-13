import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-admin-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    BoxIconComponent,
    RouterModule,
  ],
  templateUrl: './admin-sidenav.component.html',
  styleUrl: './admin-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidenavComponent {

}
