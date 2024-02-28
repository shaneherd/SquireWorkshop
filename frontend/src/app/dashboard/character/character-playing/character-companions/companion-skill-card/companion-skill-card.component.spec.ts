import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionSkillCardComponent } from './companion-skill-card.component';

xdescribe('CompanionSkillCardComponent', () => {
  let component: CompanionSkillCardComponent;
  let fixture: ComponentFixture<CompanionSkillCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionSkillCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionSkillCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
