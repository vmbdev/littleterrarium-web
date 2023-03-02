import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocationListComponent } from '@components/location/location-list/location-list.component';
import { AuthService } from '@services/auth.service';
import { SigninComponent } from '@components/user/signin/signin.component';

@Component({
  standalone: true,
  selector: 'home',
  imports: [
    CommonModule,
    SigninComponent,
    LocationListComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }
}
