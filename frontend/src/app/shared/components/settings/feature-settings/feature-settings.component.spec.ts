import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureSettingsComponent} from './feature-settings.component';

xdescribe('FeatureSettingsComponent', () => {
  let component: FeatureSettingsComponent;
  let fixture: ComponentFixture<FeatureSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
