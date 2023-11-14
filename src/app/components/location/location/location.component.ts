import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { InfoBoxComponent } from '@components//info-box/info-box.component';
import {
  PlantListComponent
} from '@components/plant/plant-list/plant-list.component';
import {
  PropertyBoxComponent
} from '@components/property-box/property-box.component';
import {
  ToolboxComponent
} from '@components/toolbox/toolbox/toolbox.component';
import {
  ToolboxButtonComponent
} from '@components/toolbox/toolbox-button/toolbox-button.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';
import { ModalService } from '@services/modal.service';

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
    ToolboxComponent,
    ToolboxButtonComponent,
    InfoBoxComponent,
    PropertyBoxComponent
  ]
})
export class LocationComponent {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  /**
   * Id number of the location, as represented in the database, and obtained
   * from the route.
   */
  private id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public locationService: LocationService,
    private breadcrumb: BreadcrumbService,
    private errorHandler: ErrorHandlerService,
    private modal: ModalService
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

  openDeleteModal(): void {
    this.modal.open(this.deleteModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.delete()
    });
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
