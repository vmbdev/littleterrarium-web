import { Route } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'

export const USER_ROUTES: Route[] = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./user-edit/user-edit.component').then(
        m => m.UserEditComponent
      ),
    canActivate: [AuthGuard]
  }
];