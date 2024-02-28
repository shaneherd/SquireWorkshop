import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VehicleInfoComponent} from './vehicle-info.component';

xdescribe('VehicleInfoComponent', () => {
  let component: VehicleInfoComponent;
  let fixture: ComponentFixture<VehicleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
