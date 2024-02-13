import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';

import { QuickModalComponent } from '@components/modals/quick-modal/quick-modal.component';
import { InfoBoxComponent } from '@components/info-box/info-box.component';
import { PhotoEditComponent } from '@components/photo/photo-edit/photo-edit.component';
import { ContentNavigatorComponent } from '@components/content-navigator/content-navigator.component';
import { ToolboxComponent } from '@components/toolbox/toolbox/toolbox.component';
import { ToolboxButtonComponent } from '@components/toolbox/toolbox-button/toolbox-button.component';
import { PropertyPublicComponent } from '@components/property-public/property-public.component';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ModalService } from '@services/modal.service';
import { NavigationData, Photo } from '@models/photo.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

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
    ImagePathPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoComponent {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  protected enablePhotoEditing: boolean = false;
  protected navigation: NavigationData = {};
  protected photo$?: Observable<Photo | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly breadcrumb: BreadcrumbService,
    public readonly photoService: PhotoService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.photo$ = this.getCurrentPhoto();
  }

  getCurrentPhoto(): Observable<Photo | null> {
    // Angular doesn't update a component when the route only changes its
    // parameters
    return this.route.params.pipe(
      switchMap((param: Params) => {
        const id = +param['photoId'];

        return forkJoin([
          this.photoService.getNavigation(id),
          this.photoService.get(id),
          of(id),
        ]);
      }),
      tap(([navigation, photo, id]) => {
        this.breadcrumb.setNavigation(
          [
            {
              selector: 'photo',
              name: $localize`:@@general.photo:Photo`,
              link: ['/photo', id],
            },
          ],
          { attachTo: 'plant', parent: photo.plantId },
        );

        this.navigation = navigation;
      }),
      switchMap(() => this.photoService.photo$),
    );
  }

  openDeleteModal(): void {
    this.modal.open(this.deleteModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.delete();
    });
  }

  delete(): void {
    const photo = this.photoService.current();

    if (photo) {
      this.photoService.delete().subscribe({
        next: () => {
          this.router.navigate(['/plant', photo.plantId]);
        },
        error: () => {
          this.errorHandler.push(
            $localize`:@@photo.deleteError:Error while deleting the photo.`,
          );
        },
      });
    }
  }
}
