import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, Light, Plant } from 'src/app/interfaces';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { ApiService } from 'src/app/shared/api/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  private id!: number;
  isValidId!: boolean;
  location!: Location;
  confirmDelete: boolean = false;
  owned: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private breadcrumb: BreadcrumbService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.isValidId = true;

      this.api.getLocation(this.id, true).subscribe({
        next: (location) => {
          this.location = location;
          this.breadcrumb.setNavigation([
            { id: 'location', name: this.location.name, link: ['/location', this.id] },
          ])

          this.owned = (this.auth.user$.getValue()?.id === this.location.ownerId) ? true : false;
        },
        error: (error) => {
          if (error.msg === 'LOCATION_NOT_FOUND') this.isValidId = false;
        }
      });
    }
    else this.isValidId = false;
  }

  edit(): void {
    this.router.navigate(['/location', 'edit', this.id]);
  }

  delete(): void {
    this.api.deleteLocation(this.id).subscribe({
      next: (data) => {
        if (data.msg === 'LOCATION_REMOVED') this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') console.log('error');
      }
    })
  }

  getLightName(): string {
    return Light[this.location.light].desc;
  }

  getLightClass(): string {
    let modifier: string;

    if (this.location.light === 'FULLSUN') modifier = 'sun';
    else if (this.location.light === 'PARTIALSUN') modifier = 'partial';
    else modifier = 'shade';

    return `location__light-${modifier}`;
  }

  getVisibilityClass(): string {
    const modifier = this.location.public ? 'public' : 'private';
    
    return `location__visibility-${modifier}`;
  }

  getPlantsClass(): string {
    const modifier = (this.location.plants && (this.location.plants.length > 0)) ? 'exists' : 'empty';

    return `location__plants-${modifier}`;
  }
}
