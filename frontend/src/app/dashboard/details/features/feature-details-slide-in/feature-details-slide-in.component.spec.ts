import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDetailsSlideInComponent } from './feature-details-slide-in.component';

xdescribe('FeatureDetailsSlideInComponent', () => {
  let component: FeatureDetailsSlideInComponent;
  let fixture: ComponentFixture<FeatureDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
