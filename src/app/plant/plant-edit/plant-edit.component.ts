import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Location, Plant, Condition} from 'src/app/interfaces';
import { ApiService } from 'src/app/shared/api/api.service';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant-edit',
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss']
})
export class PlantEditComponent implements OnInit {
  id!: number;
  locations!: Location[];
  plantForm: FormGroup;
  plantConditions = Condition;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public plantService: PlantService,
    private api: ApiService,
    private breadcrumb: BreadcrumbService
  ) {
    this.plantForm = this.fb.group({
      customName: [],
      specieId: [],
      description: [],
      condition: [],
      locationId: [Validators.required]
    })
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['plantId'];

    if (this.id) {
      this.api.getLocationList().subscribe((locations: Location[]) => {
        this.locations = locations;
      });

      this.plantService.get(this.id).subscribe({
        next: (plant: Plant) => {
          this.plantForm.patchValue({
            customName: plant.customName,
            specieId: plant.specieId,
            description: plant.description,
            condition: plant.condition,
            locationId: plant.locationId
          });


          this.breadcrumb.setNavigation([
            { id: 'plant-edit', name: 'Edit' }
          ], { attachTo: 'plant' });
        }
      })
    }
  }

  selectSpecieId(id: any): void {
    this.plantForm.patchValue({
      specieId: id
    });
  }

  submit(): void {
    this.plantForm.patchValue({
      locationId: +this.plantForm.get('locationId')?.value
    });

    const plant: Plant = this.plantForm.value;
    plant.id = this.id;
    console.log(plant);
    
    this.plantService.update(plant).subscribe(() => {
      this.router.navigate(['/plant', this.id]);
    });
  }

  /**
   * Just to pass to the keyvalue, we don't want it to sort the conditions
   * @returns 0
   */
  noSort() {
    return 0
  }
}
