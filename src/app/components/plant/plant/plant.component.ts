import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { ToolboxModule } from '@modules/toolbox/toolbox.module';
import { QuickModalComponent } from '@components/modals/quick-modal/quick-modal.component';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { PlantEditWateringComponent } from '@components/plant/plant-edit-watering/plant-edit-watering.component';
import { PlantEditFertilizerComponent } from '@components/plant/plant-edit-fertilizer/plant-edit-fertilizer.component';
import { InfoBoxComponent } from '@components/info-box/info-box.component';
import { PlantWidgetFertilizerComponent } from '@components/plant/plant-widget-fertilizer/plant-widget-fertilizer.component';
import { PlantWidgetSoilComponent } from '@components/plant/plant-widget-soil/plant-widget-soil.component';
import { PlantWidgetWaterComponent } from '@components/plant/plant-widget-water/plant-widget-water.component';
import { PhotoListComponent } from '@components/photo/photo-list/photo-list.component';
import { PropertyBoxComponent } from '@components/property-box/property-box.component';
import { Plant, Condition } from '@models/plant.model';

@Component({
    standalone: true,
    selector: 'plant',
    templateUrl: './plant.component.html',
    styleUrls: ['./plant.component.scss'],
    imports: [
        CommonModule,
        ToolboxModule,
        QuickModalComponent,
        ConfirmModalComponent,
        InfoBoxComponent,
        PlantEditWateringComponent,
        PlantEditFertilizerComponent,
        PlantWidgetFertilizerComponent,
        PlantWidgetSoilComponent,
        PlantWidgetWaterComponent,
        PhotoListComponent,
        PropertyBoxComponent
    ]
})
export class PlantComponent implements OnInit {
  id!: number;

  plantTitle?: string;
  plantSubtitle?: string;
  plantCondition = Condition;
  plantVisibility?: boolean;

  // Quick modals
  enableWaterEditing: boolean = false;
  enableFertilizerEditing: boolean = false;
  enableEditing: boolean = false;

  // Confirm modals
  confirmDelete: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    public plantService: PlantService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('plantId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) this.fetchPlantData();
  }

  fetchPlantData(): void {
    this.plantService.get(this.id, { photos: true }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error?.msg === 'PLANT_NOT_FOUND') this.errorHandler.push($localize `:@@plant.invalid:Plant not found.`);
        else this.errorHandler.push($localize `:@@errors.server:Server error`);

        this.router.navigateByUrl('/');

        return EMPTY;
      })
    ).subscribe((plant: Plant) => {
      this.plantVisibility = plant.public;

      // if customName and/or specie exists, we use it for title and subtitle
      // otherwise we use the plant visibleName
      if (plant.customName) {
        this.plantTitle = plant.customName;

        if (plant.specie) this.plantSubtitle = plant.specie.name;
      }
      else this.plantTitle = plant.visibleName;

      this.breadcrumb.setNavigation([
        { selector: 'plant', name: plant.visibleName, link: ['/plant', this.id] }
      ], { attachTo: 'location' });
    });

  }

  edit(): void {
    this.router.navigate(['/plant/edit', this.id]);
  }

  editSoil(): void {
    this.router.navigate(['/plant/edit', this.id, 'soil']);
  }

  delete(): void {
    const plant = this.plantService.plant$.getValue();

    if (plant) {
      this.plantService.delete().subscribe(() => {
        this.router.navigate(['/location', plant.locationId])
      })
    }
  }

  getVisibilityAsset(): string {
    const name = this.plantVisibility ? 'public' : 'private';

    return `assets/visibility-${name}.png`;
  }

}