import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPasswordComponent } from './password-form.component';

describe('ConfirmPasswordComponent', () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
