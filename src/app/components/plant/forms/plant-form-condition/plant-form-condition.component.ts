import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import {
  GroupSelectorComponent,
  GroupSelectorData,
} from '@components/group-selector/group-selector.component';
import { Condition } from '@models/plant.model';
import { PlantService } from '@services/plant.service';

@Component({
  selector: 'lt-plant-form-condition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormBaseActionComponent,
    GroupSelectorComponent,
  ],
  templateUrl: './plant-form-condition.component.html',
  styleUrl: './plant-form-condition.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormConditionComponent {
  private plantService = inject(PlantService);

  protected conditions = this.getConditions();

  getConditions(): GroupSelectorData<string>[] {
    return Object.keys(Condition).map((key) => ({
      id: key,
      asset: 'heart-circle',
      color: this.plantService.getConditionColor(key),
      name: this.plantService.getConditionDesc(key),
    }));
  }
}
