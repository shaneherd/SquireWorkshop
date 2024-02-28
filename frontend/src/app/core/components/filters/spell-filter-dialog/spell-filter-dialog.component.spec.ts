import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellFilterDialogComponent } from './spell-filter-dialog.component';

xdescribe('SpellFilterDialogComponent', () => {
  let component: SpellFilterDialogComponent;
  let fixture: ComponentFixture<SpellFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
