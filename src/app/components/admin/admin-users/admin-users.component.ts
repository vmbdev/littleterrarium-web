import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { AdminService } from '@services/admin.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'lt-admin-users',
  standalone: true,
  imports: [CommonModule, BoxIconComponent, ImagePathPipe],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent {
  protected limit: number = 20;
  protected skip$ = new BehaviorSubject<number>(0);
  protected users$?: Observable<User[]>;
  protected pages$?: Observable<any[]>;

  constructor(private readonly admin: AdminService) {}

  ngOnInit(): void {
    this.users$ = this.skip$.pipe(
      switchMap((skip: number) =>
        this.admin.getUsers({
          limit: this.limit,
          skip: skip,
        })
      )
    );

    this.pages$ = this.admin.getSummary().pipe(
      map(({ users }) => {
        const pages = Math.ceil(users / this.limit);

        return Array(pages)
          .fill(0)
          .map((_, i) => i + 1);
      })
    );
  }

  load(page: number): void {
    this.skip$.next((page - 1) * this.limit);
  }
}
