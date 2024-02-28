import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureSortDialogComponent } from './feature-sort-dialog.component';

xdescribe('FeatureSortDialogComponent', () => {
  let component: FeatureSortDialogComponent;
  let fixture: ComponentFixture<FeatureSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
