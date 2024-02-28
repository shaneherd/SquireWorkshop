import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureConfigurationComponent} from './feature-configuration.component';

xdescribe('FeatureConfigurationComponent', () => {
  let component: FeatureConfigurationComponent;
  let fixture: ComponentFixture<FeatureConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
