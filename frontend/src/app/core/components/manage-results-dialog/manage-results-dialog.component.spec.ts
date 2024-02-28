import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResultsDialogComponent } from './manage-results-dialog.component';

describe('ManageResultsDialogComponent', () => {
  let component: ManageResultsDialogComponent;
  let fixture: ComponentFixture<ManageResultsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageResultsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
