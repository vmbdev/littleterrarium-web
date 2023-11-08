import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@modules/core/core.module';

/**
 * Component providing the default layout.
 */
@Component({
  standalone: true,
  selector: 'lt-default-layout',
  imports: [
    RouterModule,
    CoreModule
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {

}
