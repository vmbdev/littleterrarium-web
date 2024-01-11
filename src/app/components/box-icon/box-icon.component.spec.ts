import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxIconComponent } from './box-icon.component';

describe('BoxIconComponent', () => {
  let component: BoxIconComponent;
  let fixture: ComponentFixture<BoxIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
