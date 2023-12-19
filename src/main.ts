import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from './environments/environment';

import { AuthInterceptor } from '@interceptors/auth.interceptor';
import {
  ErrorHandlerInterceptor
} from '@interceptors/error-handler.interceptor';
import { ErrorHandlerService } from '@services/error-handler.service';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes';
import { baseUrlDevelopment, baseUrlProduction } from '@config';
import { BACKEND_URL } from './tokens';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: BACKEND_URL,
      useValue: isDevMode() ? baseUrlDevelopment : baseUrlProduction,
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    importProvidersFrom(
      RouterModule.forRoot(APP_ROUTES, {
        onSameUrlNavigation: 'reload',
      })
    ),
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => {
  console.error(err);
});
