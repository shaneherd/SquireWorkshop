import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellSlotConfigureComponent } from './creature-spell-slot-configure.component';

xdescribe('CharacterSpellSlotConfigureComponent', () => {
  let component: CreatureSpellSlotConfigureComponent;
  let fixture: ComponentFixture<CreatureSpellSlotConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellSlotConfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellSlotConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
