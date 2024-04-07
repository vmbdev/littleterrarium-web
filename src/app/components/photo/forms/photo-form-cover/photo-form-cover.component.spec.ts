import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFormCoverComponent } from './photo-form-cover.component';

describe('PhotoFormCoverComponent', () => {
  let component: PhotoFormCoverComponent;
  let fixture: ComponentFixture<PhotoFormCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFormCoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoFormCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
