import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';
import { LocationService } from '@services/location.service';
import { Light } from '@models/location.model';

type LightOptionType = {
  value: string;
  name: string;
  desc: string;
};

@Component({
  selector: 'lt-location-form-light',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormBaseActionComponent,
  ],
  templateUrl: './location-form-light.component.html',
  styleUrl: './location-form-light.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormLightComponent {
  protected readonly locationService = inject(LocationService);

  protected lightOptions$ = new BehaviorSubject<LightOptionType[]>(this.createLightOptions());

  createLightOptions(): LightOptionType[] {
    const opts: LightOptionType[] = [];

    for (const option of Object.keys(Light)) {
      opts.push({
        value: option,
        name: this.locationService.getLightName(option),
        desc: this.locationService.getLightDesc(option),
      });
    }

    return opts;
  }
}
