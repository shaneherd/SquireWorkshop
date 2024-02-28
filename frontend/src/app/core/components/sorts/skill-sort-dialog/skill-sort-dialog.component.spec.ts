import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSortDialogComponent } from './skill-sort-dialog.component';

xdescribe('SkillSortDialogComponent', () => {
  let component: SkillSortDialogComponent;
  let fixture: ComponentFixture<SkillSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
