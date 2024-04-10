import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, finalize } from 'rxjs';

import { PictureListComponent } from '@components/picture-list/picture-list.component';
import { FilterBarComponent } from '@components/filter-bar/filter-bar.component';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { PlantService } from '@services/plant.service';
import { LocationService } from '@services/location.service';
import { PlantGetConfig } from '@services/api.service';
import { ModalService } from '@services/modal.service';
import { SortColumn, SortOption, SortOrder } from '@models/sort-options.model';
import { PictureItem } from '@models/picture-item.model';
import { Plant } from '@models/plant.model';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

@Component({
  standalone: true,
  selector: 'lt-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PictureListComponent,
    FilterBarComponent,
    BoxIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly plantService = inject(PlantService);
  private readonly locationService = inject(LocationService);
  private readonly auth = inject(AuthService);
  private readonly modal = inject(ModalService);

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  @ViewChild('moveModal') moveModal!: TemplateRef<any>;

  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() user?: User;
  @Input() owned: boolean = true;
  protected order: SortOrder = 'asc';
  protected column: SortColumn = 'name';
  protected cursor?: number;
  protected lastCursor?: number;
  protected loadedPlants: number = 0;
  protected filter?: string;
  protected multipleSelect: boolean = false;

  protected pictureList$ = new BehaviorSubject<PictureItem[]>([]);
  protected count$?: Observable<number>;

  protected form = this.fb.group({
    selection: new FormControl<number[]>([]),
  });

  ngOnInit(): void {
    const storedOrder = this.auth.getPref('plantListOrder');
    const storedSort = this.auth.getPref('plantListSort');

    if (storedOrder && (storedOrder === 'asc' || storedOrder === 'desc')) {
      this.order = storedOrder;
    }

    if (storedSort && (storedSort === 'name' || storedSort === 'date')) {
      this.column = storedSort;
    }

    if (this.list) {
      this.pictureList$.next(this.createPictureListFromPlants(this.list));
    } else this.changeSorting({ column: this.column, order: this.order });

    if (this.locationId) {
      this.count$ = this.locationService.countPlants(this.locationId);
    } else this.count$ = this.plantService.count();
  }

  fetchPlants(scroll: boolean = false): void {
    let obs$: Observable<Plant[]>;
    let options: PlantGetConfig = {
      cursor: scroll && this.cursor ? this.cursor : undefined,
      filter: this.filter ?? '',
      sort: this.column,
      order: this.order,
    };

    if (!scroll) this.loadedPlants = 0;

    // in case of multiple bottom reached signals, we avoid asking twice
    if (this.cursor) this.lastCursor = this.cursor;

    if (this.locationId) {
      obs$ = this.locationService.getPlants(this.locationId, options);
    } else {
      options = {
        ...options,
        userId: this.user?.id,
        cover: true,
      };

      obs$ = this.plantService.getMany(options);
    }

    const sus = obs$
      .pipe(
        finalize(() => {
          sus.unsubscribe();
        }),
      )
      .subscribe((plants: Plant[]) => {
        let pictures: PictureItem[];

        if (plants.length > 0) {
          this.cursor = plants[plants.length - 1].id;
          this.loadedPlants += plants.length;
        }

        if (scroll) {
          pictures = [
            ...this.pictureList$.getValue(),
            ...this.createPictureListFromPlants(plants),
          ];
        } else pictures = this.createPictureListFromPlants(plants);

        this.pictureList$.next(pictures);
      });
  }

  createPictureListFromPlants(plants: Plant[]): PictureItem[] {
    const pictures: PictureItem[] = [];

    for (const plant of plants) {
      if (!plant.visibleName) {
        plant.visibleName = this.plantService.getVisibleName(plant);
      }

      pictures.push({
        id: plant.id,
        image: this.plantService.coverPhoto(plant),
        link: ['/plant', plant.id],
        name: plant.visibleName,
        sortableOptions: {
          date: plant.createdAt,
        },
      });
    }

    return pictures;
  }

  changeSorting(sorting: SortOption): void {
    this.column = sorting.column;
    this.order = sorting.order;

    this.auth
      .setPref({
        plantListSort: this.column,
        plantListOrder: this.order,
      })
      .subscribe();

    this.fetchPlants();
  }

  changeFilter(val: string): void {
    this.filter = val;

    this.fetchPlants();
  }

  enableMultipleSelect(val: boolean) {
    this.multipleSelect = val;
  }

  loadMore(): void {
    if (this.cursor !== this.lastCursor) this.fetchPlants(true);
  }

  massMove() {
    this.modal.open(this.moveModal, 'confirm').subscribe((res) => {
      if (res === 'accept') console.log('move');
    });
  }

  massDelete() {
    this.modal.open(this.deleteModal, 'confirm').subscribe((res) => {
      if (res === 'accept') console.log('del');
    });
  }
}
