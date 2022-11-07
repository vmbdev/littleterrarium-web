import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'user-logout',
  templateUrl: './user-logout.component.html'
})
export class UserLogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.logOut().subscribe({
      complete: () => { this.router.navigate(['/']) }
    });
  }

}
