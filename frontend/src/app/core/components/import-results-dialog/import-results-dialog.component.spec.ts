import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportResultsDialogComponent } from './import-results-dialog.component';

xdescribe('ImportResultsDialogComponent', () => {
  let component: ImportResultsDialogComponent;
  let fixture: ComponentFixture<ImportResultsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportResultsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
