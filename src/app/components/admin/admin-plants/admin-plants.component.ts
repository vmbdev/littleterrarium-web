import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-plants',
  standalone: true,
  imports: [],
  templateUrl: './admin-plants.component.html',
  styleUrl: './admin-plants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlantsComponent {

}
