import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureChoicePromptComponent } from './creature-choice-prompt.component';

xdescribe('CreatureChoicePromptComponent', () => {
  let component: CreatureChoicePromptComponent;
  let fixture: ComponentFixture<CreatureChoicePromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureChoicePromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureChoicePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
