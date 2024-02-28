import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellSlotsComponent } from './creature-spell-slots.component';

xdescribe('CharacterSpellSlotsComponent', () => {
  let component: CreatureSpellSlotsComponent;
  let fixture: ComponentFixture<CreatureSpellSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
