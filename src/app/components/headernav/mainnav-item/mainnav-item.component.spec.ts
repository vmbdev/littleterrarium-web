import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainnavItemComponent } from './mainnav-item.component';

describe('MainnavItemComponent', () => {
  let component: MainnavItemComponent;
  let fixture: ComponentFixture<MainnavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainnavItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainnavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
