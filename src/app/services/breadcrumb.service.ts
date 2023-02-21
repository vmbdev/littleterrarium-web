import { Injectable } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  links$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  prev: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(() => {
      this.prev = this.links$.getValue();
      this.links$.next([]);
    })
  }

  setNavigation(links: any[], options: any = {}): void {
    if (options.attachTo) {
      const newLinks = [];
      let found = false;
      let i = 0;

      while ((i < this.prev.length) && !found) {
        newLinks.push(this.prev[i]);

        if (this.prev[i].id === options.attachTo) found = true;

        i++;
      }
      
      this.links$.next(newLinks.concat([...links]));
    }
    else this.links$.next(links);
  }

}
