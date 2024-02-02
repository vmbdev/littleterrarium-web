import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { AdminService } from '@services/admin.service';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'lt-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    BoxIconComponent,
    ImagePathPipe,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  users$ = this.admin.getUsers();
  constructor(private readonly admin: AdminService) {}

  ngOnInit(): void {
  }
}
