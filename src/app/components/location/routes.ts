import { Route } from '@angular/router';
import { SignedInGuard } from '@guards/signed-in.guard';

export const LOCATION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./location-list/location-list.component').then(
        (m) => m.LocationListComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./location-add-edit/location-add-edit.component').then(
        (m) => m.LocationAddEditComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'edit/:locationId',
    loadComponent: () =>
      import('./location-add-edit/location-add-edit.component').then(
        (m) => m.LocationAddEditComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: ':locationId',
    loadComponent: () =>
      import('./location/location.component').then((m) => m.LocationComponent),
  },
];
