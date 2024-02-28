import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessComponent } from './registration-success.component';

xdescribe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
