import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import {
  FloatingListComponent
} from '@components/navigation/floating-list/floating-list.component';
import {
  MainnavItemComponent
} from '@components/navigation/mainnav-item/mainnav-item.component';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';

@Component({
  selector: 'lt-userbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoxIconComponent,
    FloatingListComponent,
    MainnavItemComponent,
  ],
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss'],
})
export class UserboxComponent {
  menuVisible: boolean = false;
  avatar?: string | null;

  constructor(public auth: AuthService, public imagePath: ImagePathService) {
    this.auth.user$
      .pipe(takeUntilDestroyed())
      .subscribe((user: User | null) => {
        // avoid calling imagePath.get endlessly on template
        if (user?.avatar) {
          this.avatar = this.imagePath.get(user.avatar, 'thumb');
        }
      });
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
}
