import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, tap } from 'rxjs';

import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { WizardComponent } from '@components/wizard/wizard/wizard.component';
import { SpecieFinderComponent } from '@components/specie-finder/specie-finder.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { PlantFormNameComponent } from '@components/plant/forms/plant-form-name/plant-form-name.component';
import { PlantFormConditionComponent } from '@components/plant/forms/plant-form-condition/plant-form-condition.component';
import { PlantFormDescriptionComponent } from '@components/plant/forms/plant-form-description/plant-form-description.component';
import { PlantFormLocationComponent } from '@components/plant/forms/plant-form-location/plant-form-location.component';
import { BreadcrumbService } from '@services/breadcrumb.service';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';

@Component({
  standalone: true,
  selector: 'lt-plant-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    WizardPageComponent,
    WizardHeaderComponent,
    SpecieFinderComponent,
    FormPrivacyComponent,
    PlantFormNameComponent,
    PlantFormConditionComponent,
    PlantFormDescriptionComponent,
    PlantFormLocationComponent,
  ],
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly plantService = inject(PlantService);
  private readonly breadcrumb = inject(BreadcrumbService);

  private id?: number;
  protected plantForm = this.fb.group({
    customName: new FormControl<string>(''),
    specieId: new FormControl<number | null>(null),
    description: new FormControl<string>(''),
    condition: new FormControl<string>('GOOD'),
    locationId: new FormControl<number | null>(null, Validators.required),
    public: new FormControl<boolean>(true, Validators.required),
  });
  protected plant$?: Observable<Plant>;
  protected removeSpecie: boolean = false;

  ngOnInit() {
    this.id = +this.route.snapshot.params['plantId'];

    if (this.id) {
      this.plant$ = this.plantService.get(this.id).pipe(
        tap((plant: Plant) => {
          this.plantForm.patchValue({
            customName: plant.customName,
            description: plant.description,
            locationId: plant.locationId,
            specieId: plant.specieId,
            condition: plant.condition,
            public: plant.public,
          });

          this.breadcrumb.setNavigation(
            [{ selector: 'plant-edit', name: 'Edit' }],
            { attachTo: 'plant' },
          );
        }),
      );
    }
  }

  submit() {
    if (!this.id || !this.plantForm.valid) return;

    const plant = {
      ...this.plantForm.value,
      id: this.id,
    } as Plant;

    this.plantService
      .update(plant, { removeSpecie: this.removeSpecie })
      .subscribe(() => {
        this.router.navigate(['/plant', this.id]);
      });
  }
}
