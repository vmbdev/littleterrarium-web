import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, Light } from 'src/app/interfaces';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { ApiService } from 'src/app/shared/api/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, EMPTY, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  private id?: number;
  location!: Location;
  confirmDelete: boolean = false;
  owned: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private breadcrumb: BreadcrumbService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {

      this.api.getLocation(this.id, true).pipe(
        map((location: Location) => {
          this.location = location;
          this.breadcrumb.setNavigation([
            { id: 'location', name: this.location.name, link: ['/location', this.id] },
          ])

          this.owned = (this.auth.user$.getValue()?.id === this.location.ownerId) ? true : false;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'LOCATION_NOT_FOUND') this.errorHandler.push($localize `:@@location.invalid:Location invalid or not found.`);
          else this.errorHandler.push($localize `:@@errors.server:Server error`);
          
          this.router.navigateByUrl('/');
  
          return EMPTY;
        })
      ).subscribe();
    }
  }

  edit(): void {
    if (this.id) this.router.navigate(['/location', 'edit', this.id]);
  }

  delete(): void {
    if (this.id) {
      this.api.deleteLocation(this.id).subscribe({
        next: (res) => {
          if (res.msg === 'LOCATION_REMOVED') this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.msg === 'LOCATION_NOT_VALID') this.errorHandler.push($localize `:@@location.invalid:Location invalid or not found`)
        }
      })
    }
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
