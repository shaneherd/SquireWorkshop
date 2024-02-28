import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditHealthHitDiceComponent } from './character-edit-health-hit-dice.component';

xdescribe('CharacterEditHealthHitDiceComponent', () => {
  let component: CharacterEditHealthHitDiceComponent;
  let fixture: ComponentFixture<CharacterEditHealthHitDiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditHealthHitDiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditHealthHitDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
