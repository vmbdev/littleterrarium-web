import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  MainnavBaseContentComponent
} from '@components/navigation/mainnav-base-content/mainnav-base-content.component';

@Component({
  selector: 'lt-mainnav-divisor',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mainnav-divisor.component.html',
  styleUrl: './mainnav-divisor.component.scss',
  providers: [{
    provide: MainnavBaseContentComponent,
    useExisting: MainnavDivisorComponent,
  }]
})
export class MainnavDivisorComponent extends MainnavBaseContentComponent {}
