import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureFilterDialogComponent } from './feature-filter-dialog.component';

xdescribe('FeatureFilterDialogComponent', () => {
  let component: FeatureFilterDialogComponent;
  let fixture: ComponentFixture<FeatureFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
