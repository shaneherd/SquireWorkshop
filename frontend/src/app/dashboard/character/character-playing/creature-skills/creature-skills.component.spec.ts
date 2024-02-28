import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSkillsComponent } from './creature-skills.component';

xdescribe('CharacterSkillsComponent', () => {
  let component: CreatureSkillsComponent;
  let fixture: ComponentFixture<CreatureSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
