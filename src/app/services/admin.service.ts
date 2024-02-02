import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api.service';
import { AdminSummary } from '@models/admin.model';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private readonly api: ApiService) {}

  getSummary(): Observable<AdminSummary> {
    return this.api.getAdminSummary();
  }

  getUsers(): Observable<User[]> {
    return this.api.getAdminUserList();
  }
}
