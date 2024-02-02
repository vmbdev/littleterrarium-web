import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminSidenavComponent } from '@components/admin/admin-sidenav/admin-sidenav.component';

@Component({
  selector: 'lt-admin',
  standalone: true,
  imports: [
    RouterModule,
    AdminSidenavComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {}
