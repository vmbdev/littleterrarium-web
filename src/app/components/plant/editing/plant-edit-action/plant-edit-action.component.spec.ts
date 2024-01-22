import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantEditActionComponent } from './plant-edit-action.component';

describe('PlantEditActionComponent', () => {
  let component: PlantEditActionComponent;
  let fixture: ComponentFixture<PlantEditActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantEditActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlantEditActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
