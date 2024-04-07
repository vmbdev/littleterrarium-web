import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { PhotoService } from '@services/photo.service';
import { PlantService } from '@services/plant.service';
import { TaskService } from '@services/task.service';

@Component({
  standalone: true,
  selector: 'lt-user-logout',
  imports: [CommonModule],
  templateUrl: './user-logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLogoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly plantService = inject(PlantService);
  private readonly photoService = inject(PhotoService);
  private readonly locationService = inject(LocationService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  logOut$?: Observable<void>;

  // For security, remove personal data stored in those services when out
  ngOnInit(): void {
    this.logOut$ = this.auth.logOut().pipe(
      tap(() => {
        this.taskService.empty();
        this.plantService.empty();
        this.photoService.empty();
        this.locationService.empty();
        this.errorHandlerService.empty();
        this.breadcrumbService.empty();
        this.router.navigate(['/']);
      }),
    );
  }
}
