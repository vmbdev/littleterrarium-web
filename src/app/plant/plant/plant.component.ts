import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Plant, Condition } from 'src/app/interfaces';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  id!: number;
  valid: boolean = false;

  plantTitle?: string;
  plantSubtitle?: string;
  plantCondition = Condition;

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
    public plantService: PlantService
  ) { }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('plantId');
    this.id = paramId ? +paramId : NaN;

    if (this.id) this.fetchPlantData();
    else this.valid = false;
  }

  fetchPlantData(): void {
    this.plantService.get(this.id).subscribe({
      next: (plant: Plant) => {
        if (plant.customName) {
          this.plantTitle = plant.customName;

          if (plant.specie) this.plantSubtitle = plant.specie.name;
        }
        else if (plant.specie) this.plantTitle = plant.specie.name
        else this.plantTitle = 'Unidentified plant';

        this.breadcrumb.setNavigation([
          { id: 'plant', name: this.plantTitle, link: ['/plant', this.id] }
        ], { attachTo: 'location' });

        this.valid = true;
      },
      error: (error) => {
        if (error.msg === 'PLANT_NOT_VALID') this.valid = false;
      }
    })
  }

  edit(): void {
    this.router.navigate(['/plant/edit', this.id]);
  }

  editSoil(): void {
    this.router.navigate(['/plant/edit', this.id, 'soil']);
  }

  delete(): void {
    const { locationId } = this.plantService.plant$.getValue();
    this.plantService.delete().subscribe(() => {
      this.router.navigate(['/location', locationId])
    })
  }

}
