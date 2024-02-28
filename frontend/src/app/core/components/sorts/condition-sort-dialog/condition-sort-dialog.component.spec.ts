import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionSortDialogComponent } from './condition-sort-dialog.component';

xdescribe('ConditionSortDialogComponent', () => {
  let component: ConditionSortDialogComponent;
  let fixture: ComponentFixture<ConditionSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
