import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location, Light } from '@models/location.model';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ToolboxModule } from '@modules/toolbox/toolbox.module';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { InfoBoxComponent } from '@components//info-box/info-box.component';
import { PlantListComponent } from '@components/plant/plant-list/plant-list.component';

@Component({
  standalone: true,
  selector: 'location',
  imports: [
    CommonModule,
    RouterModule,
    PlantListComponent,
    ToolboxModule,
    ConfirmModalComponent,
    InfoBoxComponent
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  private id?: number;
  location?: Location;
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
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'LOCATION_NOT_FOUND') this.errorHandler.push($localize `:@@location.invalid:Location invalid or not found`);
          else this.errorHandler.push($localize `:@@errors.server:Server error`);
          
          this.router.navigateByUrl('/');
          
          return EMPTY;
        })
      ).subscribe((location: Location) => {
          this.location = location;
          this.breadcrumb.setNavigation([
            { selector: 'location', name: this.location.name, link: ['/location', this.id] },
          ])
          
          this.owned = (this.auth.user$.getValue()?.id === this.location.ownerId) ? true : false;
      });
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
    return Light[this.location?.light].desc;
  }

  getLightClass(): string {
    let modifier: string;

    if (this.location?.light === 'FULLSUN') modifier = 'sun';
    else if (this.location?.light === 'PARTIALSUN') modifier = 'partial';
    else modifier = 'shade';

    return `location__light-${modifier}`;
  }

  getVisibilityClass(): string {
    const modifier = this.location?.public ? 'public' : 'private';
    
    return `location__visibility-${modifier}`;
  }

  getPlantsClass(): string {
    const modifier = (this.location?.plants && (this.location.plants.length > 0)) ? 'exists' : 'empty';

    return `location__plants-${modifier}`;
  }
}
