import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WidgetBoxComponent } from '@components/widget-box/widget-box.component';
import { AdminService } from '@services/admin.service';

@Component({
  selector: 'lt-admin-summary',
  standalone: true,
  imports: [
    CommonModule,
    WidgetBoxComponent,
  ],
  templateUrl: './admin-summary.component.html',
  styleUrl: './admin-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSummaryComponent {
  protected readonly summary$ = this.admin.getSummary();

  constructor(protected readonly admin: AdminService) {}
}
