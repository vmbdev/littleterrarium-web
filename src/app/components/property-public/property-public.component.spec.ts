import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPublicComponent } from './property-public.component';

describe('PropertyPublicComponent', () => {
  let component: PropertyPublicComponent;
  let fixture: ComponentFixture<PropertyPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyPublicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertyPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
