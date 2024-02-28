import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CarryingCapacityDisplayComponent} from './carrying-capacity-display.component';

xdescribe('CarryingCapacityDisplayComponent', () => {
  let component: CarryingCapacityDisplayComponent;
  let fixture: ComponentFixture<CarryingCapacityDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarryingCapacityDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarryingCapacityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
