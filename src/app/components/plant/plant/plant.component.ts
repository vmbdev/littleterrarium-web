import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { InfoBoxComponent } from '@components/info-box/info-box.component';
import { QuickModalComponent } from '@components/modals/quick-modal/quick-modal.component';
import { PlantEditWateringComponent } from '@components/plant/plant-edit-watering/plant-edit-watering.component';
import { PlantEditFertilizerComponent } from '@components/plant/plant-edit-fertilizer/plant-edit-fertilizer.component';
import { PlantWidgetFertilizerComponent } from '@components/plant/plant-widget-fertilizer/plant-widget-fertilizer.component';
import { PlantWidgetSoilComponent } from '@components/plant/plant-widget-soil/plant-widget-soil.component';
import { PlantWidgetWaterComponent } from '@components/plant/plant-widget-water/plant-widget-water.component';
import { PhotoListComponent } from '@components/photo/photo-list/photo-list.component';
import { ToolboxComponent } from '@components/toolbox/toolbox/toolbox.component';
import { ToolboxButtonComponent } from '@components/toolbox/toolbox-button/toolbox-button.component';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { PropertyPublicComponent } from '@components/property-public/property-public.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { ModalService } from '@services/modal.service';
import { Plant, Condition } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
  imports: [
    CommonModule,
    ToolboxComponent,
    ToolboxButtonComponent,
    QuickModalComponent,
    InfoBoxComponent,
    PlantEditWateringComponent,
    PlantEditFertilizerComponent,
    PlantWidgetFertilizerComponent,
    PlantWidgetSoilComponent,
    PlantWidgetWaterComponent,
    PhotoListComponent,
    BoxIconComponent,
    PropertyPublicComponent,
  ],
})
export class PlantComponent {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;
  @ViewChild('editWaterModal') editWaterModal!: TemplateRef<any>;

  id?: number;

  plantTitle?: string;
  plantSubtitle?: string;
  plantCondition = Condition;
  plantVisibility?: boolean;

  // Quick modals
  enableWaterEditing: boolean = false;
  enableFertilizerEditing: boolean = false;
  enableEditing: boolean = false;

  conditionColor?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('plantId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) this.fetchPlantData();
  }

  fetchPlantData(): void {
    if (!this.id) return;

    this.plantService
      .get(this.id, { photos: true })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error?.msg === 'PLANT_NOT_FOUND') {
            this.errorHandler.push(
              $localize`:@@plant.invalid:Plant not found.`,
            );
          } else {
            this.errorHandler.push($localize`:@@errors.server:Server error`);
          }

          this.router.navigateByUrl('/');

          return EMPTY;
        }),
      )
      .subscribe((plant: Plant) => {
        this.plantVisibility = plant.public;
        this.conditionColor =
          this.plantService.getConditionColor(plant.condition);

        // if customName and/or specie exists, we use it for title and subtitle
        // otherwise we use the plant visibleName
        if (plant.customName) {
          this.plantTitle = plant.customName;

          if (plant.specie) this.plantSubtitle = plant.specie.name;
        } else this.plantTitle = plant.visibleName;

        this.breadcrumb.setNavigation(
          [
            {
              selector: 'plant',
              name: this.plantService.getVisibleName(plant),
              link: ['/plant', this.id],
            },
          ],
          { attachTo: 'location', parent: plant.locationId },
        );
      });
  }

  openDeleteModal(): void {
    this.modal.open(this.deleteModal, 'confirm').subscribe((res) => {
      if (res === 'accept') this.delete();
    });
  }

  edit(): void {
    this.router.navigate(['/plant/edit', this.id]);
  }

  editSoil(): void {
    this.router.navigate(['/plant/edit', this.id, 'soil']);
  }

  delete(): void {
    const plant = this.plantService.current();

    if (plant) {
      this.plantService.delete().subscribe(() => {
        this.router.navigate(['/location', plant.locationId]);
      });
    }
  }

  getVisibilityAsset(): string {
    const name = this.plantVisibility ? 'public' : 'private';

    return `assets/visibility-${name}.png`;
  }
}
