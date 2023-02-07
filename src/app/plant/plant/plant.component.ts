import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { ErrorHandlerService } from 'src/app/error-handler/error-handler.service';
import { Plant, Condition } from 'src/app/interfaces';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
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
    this.plantService.get(this.id).pipe(
      map((plant: Plant) => {
        this.plantVisibility = plant.public;

        if (plant.customName) {
          this.plantTitle = plant.customName;

          if (plant.specie) this.plantSubtitle = plant.specie.name;
        }
        else if (plant.specie) this.plantTitle = plant.specie.name
        else this.plantTitle = plant.visibleName;

        this.breadcrumb.setNavigation([
          { id: 'plant', name: this.plantTitle, link: ['/plant', this.id] }
        ], { attachTo: 'location' });
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.error?.msg === 'PLANT_NOT_FOUND') this.errorHandler.push($localize `:@@plant.invalid:Plant not found.`);
        else this.errorHandler.push($localize `:@@errors.server:Server error`);

        this.router.navigateByUrl('/');

        return EMPTY;
      })
    ).subscribe();

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

  getVisibilityClass(): string {
    const modifier = this.plantVisibility ? 'public' : 'private';

    return `plant__visibility-${modifier}`;
  }

}
