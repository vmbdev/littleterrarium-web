import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApiService } from './api/api.service';
import { SafeUrlPipe } from './safeurl/safeurl.pipe';
import { NavigateBackService } from './navigateback/navigateback.service';
import { UnitPipe } from './unit/unit.pipe';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { CapitalizePipe } from './capitalize/capitalize.pipe';

@NgModule({
  declarations: [
    FloatingButtonComponent,
    SafeUrlPipe,
    UnitPipe,
    CapitalizePipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    ApiService,
    NavigateBackService
  ],
  exports: [
    FloatingButtonComponent,
    SafeUrlPipe,
    UnitPipe,
    CapitalizePipe
  ]
})
export class SharedModule { }
