import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordRecoveryComponent } from './user-password-recovery.component';

describe('UserPasswordRecoveryComponent', () => {
  let component: UserPasswordRecoveryComponent;
  let fixture: ComponentFixture<UserPasswordRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPasswordRecoveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
