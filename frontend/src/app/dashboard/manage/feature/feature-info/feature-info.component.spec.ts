import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureInfoComponent} from './feature-info.component';

xdescribe('FeatureInfoComponent', () => {
  let component: FeatureInfoComponent;
  let fixture: ComponentFixture<FeatureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
