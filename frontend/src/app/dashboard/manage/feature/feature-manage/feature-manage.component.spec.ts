import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureManageComponent} from './feature-manage.component';

xdescribe('FeatureManageComponent', () => {
  let component: FeatureManageComponent;
  let fixture: ComponentFixture<FeatureManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
