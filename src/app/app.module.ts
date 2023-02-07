import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './layout/layout.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { TerrariumModule } from './terrarium/terrarium.module';
import { SigninModule } from './signin/signin.module';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { ErrorHandlerModule } from './error-handler/error-handler.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    HomeModule,
    AuthModule,
    UserModule,
    TasksModule,
    TerrariumModule,
    SigninModule,
    ErrorHandlerModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
