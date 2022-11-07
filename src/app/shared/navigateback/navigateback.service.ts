import { Injectable } from '@angular/core';
import { Location as NgLocation } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateBackService {
  private history: string[] = [];

  constructor(private location: NgLocation, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }
  navigateBack() {
    this.history.pop();

    // FIXME: not working
    if (this.history.length > 0) this.location.back();
    else this.router.navigate(['/']);
  }
}
