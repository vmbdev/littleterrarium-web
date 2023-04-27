import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { BreadcrumbService } from '@services/breadcrumb.service';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ToolboxModule } from '@modules/toolbox/toolbox.module';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { QuickModalComponent } from '@components/modals/quick-modal/quick-modal.component';
import { InfoBoxComponent } from '@components/info-box/info-box.component';
import { PhotoEditComponent } from '@components/photo/photo-edit/photo-edit.component';
import { PropertyBoxComponent } from '@components/property-box/property-box.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { ImagePathService } from '@services/image-path.service';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { NavigationData, Photo } from '@models/photo.model';


@Component({
    standalone: true,
    selector: 'photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss'],
    imports: [
      CommonModule,
      RouterModule,
      PhotoEditComponent,
      ToolboxModule,
      ConfirmModalComponent,
      QuickModalComponent,
      InfoBoxComponent,
      NavigationComponent,
      PropertyBoxComponent
    ]
})
export class PhotoComponent implements OnInit {
  id?: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;
  navigation: NavigationData = { };
  plantCoverId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public photoService: PhotoService,
    private plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    public imagePath: ImagePathService
  ) { }

  ngOnInit(): void {
    // Angular doesn't update a component when the route only changes its parameters, so...
    this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    })
  }

  loadPhoto(): void {
    if (this.id) {
      this.photoService.get(this.id, { navigation: true, cover: true }).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'PHOTO_NOT_FOUND') this.errorHandler.push($localize `:@@photo.invalid:Photo not found.`);
          else this.errorHandler.push($localize `:@@errors.server:Server error`);
          
          this.router.navigateByUrl('/');
  
          return EMPTY;
        }),
        switchMap((photo: Photo) => {
          dayjs.extend(LocalizedFormat);
          this.breadcrumb.setNavigation(
            [{
              selector: 'photo',
              name: dayjs(photo.takenAt).format('LL'),
              link: ['/photo', this.id]
            }], { attachTo: 'plant', parent: photo.plantId }
          )

          return this.photoService.getNavigation(photo.id);
        }),
        switchMap((navigation: NavigationData) => {
          this.navigation = navigation;
          const photo = this.photoService.photo$.getValue();

          if (photo?.plantId) return this.plantService.getCover(photo.plantId);
          else return EMPTY;
        })
      ).subscribe((cover: any) => {
        this.plantCoverId = cover.coverId;
      });
    }
  }

  updateCoverPhoto(): void {
    const photo = this.photoService.photo$.getValue();
    
    if (photo) {
      if (photo.id === this.plantCoverId) {
        const plant = { id: photo.plantId } as Plant;
        this.plantService.update(plant, { removeCover: true }).subscribe(() => {
          this.plantCoverId = undefined;
        });
      }
      else {
        const plant = { id: photo.plantId, coverId: photo.id } as Plant;
        this.plantService.update(plant).subscribe(() => {
          this.plantCoverId = photo.id;
        });
      }
    }
  }

  delete(): void {
    const photo = this.photoService.photo$.getValue();

    if (photo) {
      this.photoService.delete().subscribe({
        next: () => {
            this.router.navigate(['/plant', photo.plantId]);
        },
        error: () => {
          this.errorHandler.push($localize `:@@photo.deleteError:Error while deleting the photo.`);
        }
      })
    }
  }

  getVisibilityAsset(): string {
    const name = this.photoService.photo$.getValue()?.public ? 'public' : 'private';
    
    return `assets/visibility-${name}.png`;
  }
}
