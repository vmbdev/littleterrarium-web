import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Photo } from 'src/app/interfaces';
import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { PhotoService } from '../photo.service';
import { catchError, EMPTY, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';


@Component({
  selector: 'photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() id!: number;
  confirmDelete: boolean = false;
  enablePhotoEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public photoService: PhotoService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('photoId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.photoService.get(this.id).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'PHOTO_NOT_FOUND') this.errorHandler.push($localize `:@@photo.invalid:Photo not found.`);
          else this.errorHandler.push($localize `:@@errors.server:Server error`);
          
          this.router.navigateByUrl('/');
  
          return EMPTY;
        })
      ).subscribe((photo: Photo) => {
        dayjs.extend(LocalizedFormat);
        this.breadcrumb.setNavigation([
          { id: 'photo', name: dayjs(photo.takenAt).format('LL'), link: ['/photo', this.id] }
        ], { attachTo: 'plant' })

      });
    }
  }

  delete(): void {
    this.photoService.delete().subscribe({
      next: (res: any) => {
        if ((res.msg === 'PHOTO_REMOVED') && (res.data.photo.plantId))
          this.router.navigate(['/plant', res.data.photo.plantId]);
      },
      error: () => {
        this.errorHandler.push($localize `:@@photo.deleteError:Error while deleting the photo.`);
      }
    })
  }
}
