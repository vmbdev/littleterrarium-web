import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainnavDivisorComponent } from './mainnav-divisor.component';

describe('MainnavDivisorComponent', () => {
  let component: MainnavDivisorComponent;
  let fixture: ComponentFixture<MainnavDivisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainnavDivisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainnavDivisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
