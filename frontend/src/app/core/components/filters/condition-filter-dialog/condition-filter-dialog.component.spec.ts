import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionFilterDialogComponent } from './condition-filter-dialog.component';

xdescribe('ConditionFilterDialogComponent', () => {
  let component: ConditionFilterDialogComponent;
  let fixture: ComponentFixture<ConditionFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
