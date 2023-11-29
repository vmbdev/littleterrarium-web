import { Component } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lt-userbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss']
})
export class UserboxComponent {
  menuVisible: boolean = false;

  constructor(
    public auth: AuthService,
    public imagePath: ImagePathService
  ) {}

  enableMenu(): void {
    this.menuVisible = true;
  }

  disableMenu(): void {
    this.menuVisible = false;
  }

  getUserAvatar(user: User): string | null {
    return user.avatar ?
      this.imagePath.get(user.avatar, 'thumb') :
      'assets/user.png';
  }

}
