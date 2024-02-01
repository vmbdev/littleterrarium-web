import { Routes } from '@angular/router';
import { AdminGuard } from '@guards/admin.guard';
import { NotSignedInGuard } from '@guards/not-signed-in.guard';
import { SignedInGuard } from '@guards/signed-in.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './components/layouts/default-layout/default-layout.component'
      ).then((m) => m.DefaultLayoutComponent),
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent,
          ),
        canActivate: [SignedInGuard],
      },
      {
        path: 'logout',
        loadComponent: () =>
          import('./components/user/user-logout/user-logout.component').then(
            (m) => m.UserLogoutComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import(
            './components/user/user-register/user-register.component'
          ).then((m) => m.UserRegisterComponent),
        canActivate: [NotSignedInGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./components/user/routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./components/location/routes').then((m) => m.LOCATION_ROUTES),
      },
      {
        path: 'plant',
        loadChildren: () =>
          import('./components/plant/routes').then((m) => m.PLANT_ROUTES),
      },
      {
        path: 'photo',
        loadChildren: () =>
          import('./components/photo/routes').then((m) => m.PHOTO_ROUTES),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./components/admin/routes').then((m) => m.ADMIN_ROUTES),
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
      },
      {
        path: 'terrarium/:username',
        loadComponent: () =>
          import('./components/terrarium/terrarium.component').then(
            (m) => m.TerrariumComponent,
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/tasks/tasks.component').then(
            (m) => m.TasksComponent,
          ),
        canActivate: [SignedInGuard],
      },
    ],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./components/layouts/signin-layout/signin-layout.component').then(
        (m) => m.SigninLayoutComponent,
      ),
    canActivate: [NotSignedInGuard],
  },
];
