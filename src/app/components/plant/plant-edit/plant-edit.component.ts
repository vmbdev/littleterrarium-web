import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { ApiService } from '@services/api.service';
import { PlantService } from '@services/plant.service';
import { WizardModule } from '@modules/wizard/wizard.module';
import { SpecieFinderComponent } from '@components/specie-finder/specie-finder.component';
import { Location } from '@models/location.model';
import { Plant, Condition } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardModule,
    SpecieFinderComponent
  ],
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss']
})
export class PlantEditComponent implements OnInit {
  id!: number;
  // TODO: async pipe?
  locations!: Location[];
  plantForm: FormGroup;
  plantConditions = Condition;
  removeSpecie: boolean = false;

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
      locationId: [Validators.required],
      public: []
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
            locationId: plant.locationId,
            public: plant.public
          });


          this.breadcrumb.setNavigation([
            { selector: 'plant-edit', name: 'Edit' }
          ], { attachTo: 'plant' });
        }
      })
    }
  }

  selectSpecieId(id: any): void {
    this.removeSpecie = (id === null);

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
    
    this.plantService.update(plant, { removeSpecie: this.removeSpecie }).subscribe(() => {
      this.router.navigate(['/plant', this.id])
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
