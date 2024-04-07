import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { FloatingListComponent } from '@components/navigation/floating-list/floating-list.component';
import { MainnavItemComponent } from '@components/navigation/mainnav-item/mainnav-item.component';
import { AuthService } from '@services/auth.service';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'lt-userbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoxIconComponent,
    FloatingListComponent,
    MainnavItemComponent,
    ImagePathPipe,
  ],
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserboxComponent {
  protected menuVisible: boolean = false;

  constructor(protected readonly auth: AuthService) {}

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
}
