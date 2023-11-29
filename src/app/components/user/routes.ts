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
  },
  {
    path: 'recover',
    loadComponent: () => 
      import('./user-password-recovery/user-password-recovery.component').then(
        m => m.UserPasswordRecoveryComponent
      )
  },
  {
    path: 'reset/:userId/:token',
    loadComponent: () => 
      import('./user-password-reset/user-password-reset.component').then(
        m => m.UserPasswordResetComponent
      )
  }
];