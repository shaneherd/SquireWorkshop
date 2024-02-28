import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSkillCardComponent } from './creature-skill-card.component';

xdescribe('CharacterSkillCardComponent', () => {
  let component: CreatureSkillCardComponent;
  let fixture: ComponentFixture<CreatureSkillCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSkillCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSkillCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
