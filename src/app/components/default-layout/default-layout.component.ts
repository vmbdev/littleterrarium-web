import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorToastComponent } from '@components/error-toast/error-toast.component';
import { FooternavComponent } from '@components/footernav/footernav.component';
import { MainnavComponent } from '@components/headernav/mainnav/mainnav.component';

/**
 * Component providing the default layout.
 */
@Component({
  standalone: true,
  selector: 'lt-default-layout',
  imports: [
    RouterModule,
    MainnavComponent,
    FooternavComponent,
    ErrorToastComponent,
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {}
