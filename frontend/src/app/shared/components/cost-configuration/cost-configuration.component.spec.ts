import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CostConfigurationComponent} from './cost-configuration.component';

xdescribe('CostConfigurationComponent', () => {
  let component: CostConfigurationComponent;
  let fixture: ComponentFixture<CostConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
