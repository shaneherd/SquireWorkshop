import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterFilterDialogComponent } from './monster-filter-dialog.component';

xdescribe('MonsterFilterDialogComponent', () => {
  let component: MonsterFilterDialogComponent;
  let fixture: ComponentFixture<MonsterFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
