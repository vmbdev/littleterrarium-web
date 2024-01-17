import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';

import {
  QuickModalComponent
} from '@components/modals/quick-modal/quick-modal.component';
import { InfoBoxComponent } from '@components/info-box/info-box.component';
import {
  PhotoEditComponent
} from '@components/photo/photo-edit/photo-edit.component';
import {
  ContentNavigatorComponent
} from '@components/content-navigator/content-navigator.component';
import {
  ToolboxComponent
} from '@components/toolbox/toolbox/toolbox.component';
import {
  ToolboxButtonComponent
} from '@components/toolbox/toolbox-button/toolbox-button.component';
import { PropertyPublicComponent } from '@components/property-public/property-public.component';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ImagePathService } from '@services/image-path.service';
import { NavigationData, Photo } from '@models/photo.model';
import { ModalService } from '@services/modal.service';

@Component({
  standalone: true,
  selector: 'lt-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    PhotoEditComponent,
    ToolboxComponent,
    ToolboxButtonComponent,
    QuickModalComponent,
    InfoBoxComponent,
    ContentNavigatorComponent,
    PropertyPublicComponent,
    BoxIconComponent,
  ],
})
export class PhotoComponent {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  id?: number;
  enablePhotoEditing: boolean = false;
  navigation: NavigationData = {};

  imageFull: string | null = null;
  imageMid: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public photoService: PhotoService,
    private errorHandler: ErrorHandlerService,
    private imagePath: ImagePathService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    // Angular doesn't update a component when the route only changes its
    // parameters
    this.route.params.subscribe((param: Params) => {
      this.id = param['photoId'];
      this.loadPhoto();
    });
  }

  loadPhoto(): void {
    if (this.id) {
      this.photoService
        .get(this.id, { navigation: true, cover: true })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.error?.msg === 'PHOTO_NOT_FOUND') {
              this.errorHandler.push(
                $localize`:@@photo.invalid:Photo not found.`
              );
            } else {
              this.errorHandler.push($localize`:@@errors.server:Server error`);
            }

            this.router.navigateByUrl('/');

            return EMPTY;
          }),
          switchMap((photo: Photo) => {
            this.imageFull = this.imagePath.get(photo.images, 'full');
            this.imageMid = this.imagePath.get(photo.images, 'mid');

            this.breadcrumb.setNavigation(
              [
                {
                  selector: 'photo',
                  name: $localize `:@@general.photo:Photo`,
                  link: ['/photo', this.id],
                },
              ],
              { attachTo: 'plant', parent: photo.plantId }
            );

            return this.photoService.getNavigation(photo.id);
          }),
        )
        .subscribe((navigation: NavigationData) => {
          this.navigation = navigation;
          // const photo = this.photoService.getValue();
        });
    }
  }

  openDeleteModal(): void {
    this.modal.open(this.deleteModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.delete();
    });
  }

  delete(): void {
    const photo = this.photoService.getValue();

    if (photo) {
      this.photoService.delete().subscribe({
        next: () => {
          this.router.navigate(['/plant', photo.plantId]);
        },
        error: () => {
          this.errorHandler.push(
            $localize`:@@photo.deleteError:Error while deleting the photo.`
          );
        },
      });
    }
  }

  getVisibilityAsset(): string {
    const name = this.photoService.getValue()?.public
      ? 'public'
      : 'private';

    return `assets/visibility-${name}.png`;
  }
}
