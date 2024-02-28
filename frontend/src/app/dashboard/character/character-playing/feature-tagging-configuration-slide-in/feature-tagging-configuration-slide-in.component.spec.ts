import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTaggingConfigurationSlideInComponent } from './feature-tagging-configuration-slide-in.component';

xdescribe('FeatureTaggingConfigurationSlideInComponent', () => {
  let component: FeatureTaggingConfigurationSlideInComponent;
  let fixture: ComponentFixture<FeatureTaggingConfigurationSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureTaggingConfigurationSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureTaggingConfigurationSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
