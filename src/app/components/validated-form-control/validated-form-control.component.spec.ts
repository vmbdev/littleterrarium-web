import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedFormControlComponent } from './validated-form-control.component';

describe('ValidatedFormControlComponent', () => {
  let component: ValidatedFormControlComponent;
  let fixture: ComponentFixture<ValidatedFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatedFormControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidatedFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
