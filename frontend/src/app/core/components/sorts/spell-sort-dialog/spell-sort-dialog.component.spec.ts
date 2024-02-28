import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSortDialogComponent } from './spell-sort-dialog.component';

xdescribe('SpellSortDialogComponent', () => {
  let component: SpellSortDialogComponent;
  let fixture: ComponentFixture<SpellSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
