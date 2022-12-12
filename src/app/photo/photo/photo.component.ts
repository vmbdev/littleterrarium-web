import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Photo } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';
import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AuthService } from 'src/app/auth/auth.service';
import { PhotoService } from '../photo.service';


@Component({
  selector: 'photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() id!: number;

  // Confirm modals
  confirmDelete: boolean = false;

  enablePhotoEditing: boolean = false;
  isValidId?: boolean;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public photoService: PhotoService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('photoId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.photoService.get(this.id).subscribe({
        next: (photo: Photo) => {
          this.isValidId = true;

          dayjs.extend(LocalizedFormat);
          this.breadcrumb.setNavigation([
            { id: 'photo', name: dayjs(photo.takenAt).format('LL'), link: ['/photo', this.id] }
          ], { attachTo: 'plant' })

        },
        error: (error) => {
          if (error.msg === 'PLANT_NOT_FOUND') this.isValidId = false;
        }
      });
    }
    else this.isValidId = false;
  }

  delete(): void {
    this.photoService.delete().subscribe({
      next: (res: any) => {
        if ((res.msg === 'PHOTO_REMOVED') && (res.data.photo.plantId))
          this.router.navigate(['/plant', res.data.photo.plantId]);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
