import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrivacyComponent } from './form-privacy.component';

describe('FormPrivacyComponent', () => {
  let component: FormPrivacyComponent;
  let fixture: ComponentFixture<FormPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPrivacyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
