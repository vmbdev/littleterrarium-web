import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, tap } from 'rxjs';

import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { SpecieFinderComponent } from '@components/specie-finder/specie-finder.component';
import {
  GroupSelectorData,
  GroupSelectorComponent,
} from '@components/group-selector/group-selector.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { PlantService } from '@services/plant.service';
import { LocationService } from '@services/location.service';
import { Plant, Condition } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    SpecieFinderComponent,
    GroupSelectorComponent,
  ],
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditComponent {
  private id?: number;
  protected plantForm: FormGroup = this.fb.group({
    customName: [],
    specieId: [],
    description: [],
    condition: [],
    locationId: [Validators.required],
    public: [],
  });
  protected locations$ = this.locationService.getMany();
  protected plant$?: Observable<Plant>;
  protected removeSpecie: boolean = false;
  protected conditions = this.getConditions();
  protected defaultCondition: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly plantService: PlantService,
    private readonly locationService: LocationService,
    private readonly breadcrumb: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['plantId'];

    if (this.id) {
      this.plant$ = this.plantService.get(this.id).pipe(
        tap((plant: Plant) => {
          this.defaultCondition = plant.condition;

          this.plantForm.patchValue({
            customName: plant.customName,
            specieId: plant.specieId,
            description: plant.description,
            condition: plant.condition,
            locationId: plant.locationId,
            public: plant.public,
          });

          this.breadcrumb.setNavigation(
            [{ selector: 'plant-edit', name: 'Edit' }],
            { attachTo: 'plant' },
          );
        })
      )
    }
  }

  selectSpecieId(id: any): void {
    this.removeSpecie = id === null;

    this.plantForm.patchValue({
      specieId: id,
    });
  }

  handleChange(id: string): void {
    this.plantForm.patchValue({
      condition: id,
    });
  }

  getConditions(): GroupSelectorData<string>[] {
    return Object.keys(Condition).map((key) => ({
      id: key,
      asset: 'heart-circle',
      color: this.plantService.getConditionColor(key),
      name: this.plantService.getConditionDesc(key),
    }));
  }

  submit(): void {
    if (!this.id) return;

    this.plantForm.patchValue({
      locationId: +this.plantForm.get('locationId')?.value,
    });

    const plant: Plant = this.plantForm.value;
    plant.id = this.id;

    this.plantService
      .update(plant, { removeSpecie: this.removeSpecie })
      .subscribe(() => {
        this.router.navigate(['/plant', this.id]);
      });
  }

  /**
   * Just to pass to the keyvalue, we don't want it to sort the conditions
   * @returns 0
   */
  noSort() {
    return 0;
  }
}
