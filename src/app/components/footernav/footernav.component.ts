import { Component } from '@angular/core';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-footernav',
  standalone: true,
  imports: [BoxIconComponent],
  templateUrl: './footernav.component.html',
  styleUrls: ['./footernav.component.scss'],
})
export class FooternavComponent {}
