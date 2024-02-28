import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightConfigurationComponent } from './weight-configuration.component';

xdescribe('WeightConfigurationComponent', () => {
  let component: WeightConfigurationComponent;
  let fixture: ComponentFixture<WeightConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
