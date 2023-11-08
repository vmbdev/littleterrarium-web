import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { ToolboxModule } from '@modules/toolbox/toolbox.module';
import {
  ConfirmModalComponent
} from '@components/modals/confirm-modal/confirm-modal.component';
import { InfoBoxComponent } from '@components//info-box/info-box.component';
import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import {
  PropertyBoxComponent
} from '@components/property-box/property-box.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';

/**
 * Component providing visualization for a Location model.
 */
@Component({
  standalone: true,
  selector: 'lt-location',
  templateUrl: './location.component.html',
  imports: [
    CommonModule,
    RouterModule,
    PlantListComponent,
    ToolboxModule,
    ConfirmModalComponent,
    InfoBoxComponent,
    PropertyBoxComponent
  ]
})
export class LocationComponent {
  /**
   * Id number of the location, as represented in the database, and obtained
   * from the route.
   */
  private id?: number;

  /**
   * Variable to control whether the ConfirmModal for deletion is opened.
   */
  confirmDelete: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public locationService: LocationService,
    private breadcrumb: BreadcrumbService,
    private errorHandler: ErrorHandlerService
  ) { }

  /**
   * On component creation, read the route to obtain the Id and fetch the
   * location object from the database.
   */
  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('locationId');
    this.id = paramId ? +paramId : NaN;
    
    if (this.id) {
      
      this.locationService.get(this.id, { plantCount: true}).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'LOCATION_NOT_FOUND') {
            this.errorHandler.push(
              $localize `:@@location.invalid:Location invalid or not found`
            );
          }
          else this.errorHandler.push($localize `:@@errors.server:Server error`);
          
          this.router.navigateByUrl('/');
          
          return EMPTY;
        })
      ).subscribe((location: Location) => {
        this.breadcrumb.setNavigation([
          {
            selector: 'location',
            name: location.name,
            link: ['/location', this.id]
          },
        ])
      });
    }
  }

  edit(): void {
    if (this.id) this.router.navigate(['/location', 'edit', this.id]);
  }

  delete(): void {
    if (this.id) {
      this.locationService.delete(this.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.msg === 'LOCATION_NOT_VALID') {
            this.errorHandler.push(
              $localize `:@@location.invalid:Location invalid or not found`
            );
          }
        }
      })
    }
  }

  getVisibilityAsset(visible: boolean): string {
    const name = visible ? 'public' : 'private';
    
    return `assets/visibility-${name}.png`;
  }

  getPlantsAsset(count?: number): string {
    return `assets/plants-${count && (count > 0) ? 'exists' : 'empty'}.png`;
  }
}
