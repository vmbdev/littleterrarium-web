import { Route } from '@angular/router';
import { SignedInGuard } from '@guards/signed-in.guard';

export const PLANT_ROUTES: Route[] = [
  {
    path: 'all',
    loadComponent: () =>
      import('./plant-all/plant-all.component').then(
        (m) => m.PlantAllComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'create/:locationId',
    loadComponent: () =>
      import('./plant-add/plant-add.component').then(
        (m) => m.PlantAddComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'edit/:plantId',
    loadComponent: () =>
      import('./editing/plant-edit/plant-edit.component').then(
        (m) => m.PlantEditComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'edit/:plantId/soil',
    loadComponent: () =>
      import('./editing/plant-edit-soil/plant-edit-soil.component').then(
        (m) => m.PlantEditSoilComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: ':plantId',
    loadComponent: () =>
      import('./plant/plant.component').then((m) => m.PlantComponent),
  },
];
