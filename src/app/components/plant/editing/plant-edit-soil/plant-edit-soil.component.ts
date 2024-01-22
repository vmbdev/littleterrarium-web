import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageDescriptionComponent } from '@components/wizard/wizard-page-description/wizard-page-description.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import {
  GroupSelectorData,
  GroupSelectorComponent,
} from '@components/group-selector/group-selector.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { PlantService } from '@services/plant.service';
import { Plant, PotNames } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit-soil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardPageDescriptionComponent,
    WizardHeaderComponent,
    GroupSelectorComponent,
  ],
  templateUrl: './plant-edit-soil.component.html',
  styleUrls: ['./plant-edit-soil.component.scss'],
})
export class PlantEditSoilComponent {
  private id?: number;
  protected potForm: FormGroup;

  protected defaultPot: string | null = null;
  protected pots: GroupSelectorData<string>[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly plantService: PlantService,
    private readonly breadcrumb: BreadcrumbService,
  ) {
    this.potForm = this.fb.group({
      potSize: [],
      potSizeUnits: ['cm', Validators.required],
      potType: [],
      soil: [],
    });

    this.pots = this.getPots();
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['plantId'];

    if (this.id) {
      this.plantService.get(this.id).subscribe({
        next: (plant: Plant) => {
          this.defaultPot = plant.potType;
          this.potForm.patchValue({
            potSize: plant.potSize,
            soil: plant.soil,
          });

          this.breadcrumb.setNavigation(
            [{ selector: 'plant-edit-soil', name: 'Edit pot and soil' }],
            { attachTo: 'plant' },
          );
        },
      });
    }
  }

  handleChange(id: any): void {
    this.potForm.patchValue({
      potType: id,
    });
  }

  getPots(): GroupSelectorData<string>[] {
    return Object.keys(PotNames).map((key) => {
      const pot = this.plantService.getPotInfo(key);
      return {
        id: key,
        asset: pot.image,
        name: pot.name,
      };
    });
  }

  submit(): void {
    if (!this.id) return;

    const plant: Plant = this.potForm.value;
    plant.id = this.id;

    if (plant.potSize) {
      plant.potSize =
        this.potForm.value.potSizeUnits === 'in'
          ? plant.potSize * 2.54
          : plant.potSize;
    }

    this.plantService.update(plant).subscribe(() => {
      this.router.navigate(['/plant', this.id]);
    });
  }
}
