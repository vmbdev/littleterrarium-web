import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainnavBaseContentComponent } from './mainnav-base-content.component';

describe('MainnavBaseContentComponent', () => {
  let component: MainnavBaseContentComponent;
  let fixture: ComponentFixture<MainnavBaseContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainnavBaseContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainnavBaseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
