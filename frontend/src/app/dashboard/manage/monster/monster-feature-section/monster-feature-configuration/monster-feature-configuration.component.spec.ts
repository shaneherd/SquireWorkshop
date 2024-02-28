import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterFeatureConfigurationComponent} from './monster-feature-configuration.component';

xdescribe('MonsterFeatureConfigurationComponent', () => {
  let component: MonsterFeatureConfigurationComponent;
  let fixture: ComponentFixture<MonsterFeatureConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterFeatureConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterFeatureConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
