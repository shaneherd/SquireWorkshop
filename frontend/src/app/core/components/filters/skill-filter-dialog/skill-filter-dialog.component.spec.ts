import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillFilterDialogComponent } from './skill-filter-dialog.component';

xdescribe('SkillFilterDialogComponent', () => {
  let component: SkillFilterDialogComponent;
  let fixture: ComponentFixture<SkillFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
