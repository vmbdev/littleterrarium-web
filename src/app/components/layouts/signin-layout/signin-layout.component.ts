import { Component } from '@angular/core';

import { SigninComponent } from '@components/user/signin/signin.component';

@Component({
  selector: 'lt-signin-layout',
  standalone: true,
  imports: [
    SigninComponent,
  ],
  templateUrl: './signin-layout.component.html',
  styleUrl: './signin-layout.component.scss'
})
export class SigninLayoutComponent {

}
// DC8686 FF8080