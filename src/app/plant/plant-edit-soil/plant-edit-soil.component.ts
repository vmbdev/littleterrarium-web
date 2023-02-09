import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/breadcrumb/breadcrumb.service';
import { Plant, potChoices } from 'src/app/interfaces';
import { PlantService } from '../plant.service';

@Component({
  selector: 'plant-edit-soil',
  templateUrl: './plant-edit-soil.component.html',
  styleUrls: ['./plant-edit-soil.component.scss']
})
export class PlantEditSoilComponent implements OnInit {
  id!: number;
  potForm: FormGroup;
  selectedPot: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public plantService: PlantService,
    private breadcrumb: BreadcrumbService
  ) {
    this.potForm = this.fb.group({
      potSize: [],
      potSizeUnits: ['cm', Validators.required],
      potType: [],
      soil: [],
    })
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['plantId'];

    if (this.id) {
      this.plantService.get(this.id).subscribe({
        next: (plant: Plant) => {
          this.selectPot(plant.potType);

          this.potForm.patchValue({
            potSize: plant.potSize,
            soil: plant.soil
          });

          this.breadcrumb.setNavigation([
            { id: 'plant-edit-soil', name: 'Edit pot and soil' }
          ], { attachTo: 'plant' });
        }
      })
    }
  }

  selectPot(id: any): void {
    // deselect 
    if (id === this.selectedPot) this.selectedPot = null;
    else this.selectedPot = id;

    this.potForm.patchValue({
      potType: this.selectedPot
    });
  }

  pots(): any[] {
    return Object.keys(potChoices).map(key => { return { id: key, ...potChoices[key] } });
  }

  submit(): void {
    const plant: Plant = this.potForm.value;
    plant.id = this.id;

    if (plant.potSize) {
      plant.potSize = this.potForm.value.potSizeUnits === 'in' ? plant.potSize * 2.54 : plant.potSize;
    }

    this.plantService.update(plant).subscribe({
      next: () => { this.router.navigate(['/plant', this.id]) },
      error: (err) => { console.log(err) }
    });
  }
}