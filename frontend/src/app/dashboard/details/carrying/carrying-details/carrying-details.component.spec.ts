import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarryingDetailsComponent } from './carrying-details.component';

xdescribe('CarryingDetailsComponent', () => {
  let component: CarryingDetailsComponent;
  let fixture: ComponentFixture<CarryingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarryingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarryingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
