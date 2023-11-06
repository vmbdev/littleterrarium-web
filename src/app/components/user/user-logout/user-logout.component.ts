import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  standalone: true,
  selector: 'lt-user-logout',
  templateUrl: './user-logout.component.html'
})
export class UserLogoutComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.logOut().subscribe(() => {
      this.router.navigate(['/'])
    });
  }

}
