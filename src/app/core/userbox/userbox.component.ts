import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'userbox',
  templateUrl: './userbox.component.html',
  styleUrls: ['./userbox.component.scss']
})
export class UserboxComponent implements OnInit {
  menuVisible: boolean = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
  }

  enableMenu(): void {
    this.menuVisible = true;
  }

  disableMenu(): void {
    this.menuVisible = false;
  }

}
