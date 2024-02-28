import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HealthCalculatorComponent} from './health-calculator.component';

xdescribe('HealthCalculatorComponent', () => {
  let component: HealthCalculatorComponent;
  let fixture: ComponentFixture<HealthCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
