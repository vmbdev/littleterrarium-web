import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlantsComponent } from './admin-plants.component';

describe('AdminPlantsComponent', () => {
  let component: AdminPlantsComponent;
  let fixture: ComponentFixture<AdminPlantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPlantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPlantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
