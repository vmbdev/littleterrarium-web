import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admin/admin.component').then(
        (m) => m.AdminComponent,
      ),
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
        import('./admin-summary/admin-summary.component').then((m) => m.AdminSummaryComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
        import('./admin-users/admin-users.component').then((m) => m.AdminUsersComponent)
      },
      {
        path: 'locations',
        loadComponent: () =>
        import('./admin-locations/admin-locations.component').then((m) => m.AdminLocationsComponent)
      },
      {
        path: 'plants',
        loadComponent: () =>
        import('./admin-plants/admin-plants.component').then((m) => m.AdminPlantsComponent)
      }
    ]
  },
];
