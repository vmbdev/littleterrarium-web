import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Photo } from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';
import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() id!: number;
  isValidId!: boolean;
  photo?: Photo;
  owned?: boolean;

  // Confirm modals
  confirmDelete: boolean = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('photoId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) {
      this.isValidId = true;

      this.api.getPhoto(this.id).subscribe({
        next: (data) => {
          this.photo = data;
          this.owned = (this.auth.getUser()?.id === this.photo.ownerId) ? true : false;

          dayjs.extend(LocalizedFormat);
          this.breadcrumb.setNavigation([
            { id: 'photo', name: dayjs(this.photo.takenAt).format('LL'), link: ['/photo', this.id] }
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
    this.api.deletePhoto(this.id).subscribe(() => {
      this.router.navigate(['/plant', this.photo?.plantId])
    })
  }
}
