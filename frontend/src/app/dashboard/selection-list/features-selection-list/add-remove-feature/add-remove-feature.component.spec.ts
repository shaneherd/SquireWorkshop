import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveFeatureComponent } from './add-remove-feature.component';

xdescribe('AddRemoveFeatureComponent', () => {
  let component: AddRemoveFeatureComponent;
  let fixture: ComponentFixture<AddRemoveFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
