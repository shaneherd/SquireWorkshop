import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDetailsComponent } from './skill-details.component';

xdescribe('SkillDetailsComponent', () => {
  let component: SkillDetailsComponent;
  let fixture: ComponentFixture<SkillDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
