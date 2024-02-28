import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureAbilityCardComponent } from './creature-ability-card.component';

xdescribe('CharacterAbilityCardComponent', () => {
  let component: CreatureAbilityCardComponent;
  let fixture: ComponentFixture<CreatureAbilityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureAbilityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureAbilityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
