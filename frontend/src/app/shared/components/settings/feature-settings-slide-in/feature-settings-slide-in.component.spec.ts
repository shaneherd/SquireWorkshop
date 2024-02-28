import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureSettingsSlideInComponent} from './feature-settings-slide-in.component';

xdescribe('FeatureSettingsSlideInComponent', () => {
  let component: FeatureSettingsSlideInComponent;
  let fixture: ComponentFixture<FeatureSettingsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSettingsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSettingsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
