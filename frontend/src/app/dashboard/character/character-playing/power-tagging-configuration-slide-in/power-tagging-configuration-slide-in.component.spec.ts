import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerTaggingConfigurationSlideInComponent } from './power-tagging-configuration-slide-in.component';

xdescribe('PowerTaggingConfigurationSlideInComponent', () => {
  let component: PowerTaggingConfigurationSlideInComponent;
  let fixture: ComponentFixture<PowerTaggingConfigurationSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerTaggingConfigurationSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerTaggingConfigurationSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
