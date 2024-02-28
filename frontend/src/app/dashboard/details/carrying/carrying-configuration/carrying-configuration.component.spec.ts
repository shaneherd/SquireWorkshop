import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarryingConfigurationComponent } from './carrying-configuration.component';

xdescribe('CarryingConfigurationComponent', () => {
  let component: CarryingConfigurationComponent;
  let fixture: ComponentFixture<CarryingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarryingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarryingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
