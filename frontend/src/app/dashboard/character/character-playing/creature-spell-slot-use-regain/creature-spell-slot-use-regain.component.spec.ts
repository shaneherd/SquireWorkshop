import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellSlotUseRegainComponent } from './creature-spell-slot-use-regain.component';

xdescribe('CharacterSpellSlotUseRegainComponent', () => {
  let component: CreatureSpellSlotUseRegainComponent;
  let fixture: ComponentFixture<CreatureSpellSlotUseRegainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellSlotUseRegainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellSlotUseRegainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
