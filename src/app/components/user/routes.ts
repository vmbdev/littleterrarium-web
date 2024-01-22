import { Route } from '@angular/router';
import { SignedInGuard } from '@guards/signed-in.guard';

export const USER_ROUTES: Route[] = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./user-edit/user-edit.component').then(
        (m) => m.UserEditComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'recover',
    loadComponent: () =>
      import('./user-password-recovery/user-password-recovery.component').then(
        (m) => m.UserPasswordRecoveryComponent,
      ),
  },
  {
    path: 'reset',
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('./user-password-change/user-password-change.component').then(
            (m) => m.UserPasswordChangeComponent,
          ),
        canActivate: [SignedInGuard],
      },
      {
        path: ':userId/:token',
        loadComponent: () =>
          import('./user-password-reset/user-password-reset.component').then(
            (m) => m.UserPasswordResetComponent,
          ),
      },
    ],
  },
];
