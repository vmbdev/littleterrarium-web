import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
})
export class UserLogoutComponent {
  logOut$?: Observable<void>;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly taskService: TaskService,
    private readonly plantService: PlantService,
    private readonly photoService: PhotoService,
    private readonly locationService: LocationService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly breadcrumbService: BreadcrumbService,
  ) {}

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
