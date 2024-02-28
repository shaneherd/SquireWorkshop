import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTaggingConfigurationComponent } from './feature-tagging-configuration.component';

xdescribe('FeatureTaggingConfigurationComponent', () => {
  let component: FeatureTaggingConfigurationComponent;
  let fixture: ComponentFixture<FeatureTaggingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureTaggingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureTaggingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
