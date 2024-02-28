import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSortDialogComponent } from './note-sort-dialog.component';

xdescribe('NoteSortDialogComponent', () => {
  let component: NoteSortDialogComponent;
  let fixture: ComponentFixture<NoteSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
