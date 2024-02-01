import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'lt-admin',
  standalone: true,
  imports: [
    CommonModule,
    WidgetBoxComponent,
    BoxIconComponent,
    RouterModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  protected readonly summary$ = this.admin.getSummary();

  constructor(protected readonly admin: AdminService) {}
}
