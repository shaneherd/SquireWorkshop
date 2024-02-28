import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFilterDialogComponent } from './note-filter-dialog.component';

xdescribe('NoteFilterDialogComponent', () => {
  let component: NoteFilterDialogComponent;
  let fixture: ComponentFixture<NoteFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
