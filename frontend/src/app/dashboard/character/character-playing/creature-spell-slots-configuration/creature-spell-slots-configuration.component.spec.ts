import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellSlotsConfigurationComponent } from './creature-spell-slots-configuration.component';

xdescribe('CharacterSpellSlotsConfigurationComponent', () => {
  let component: CreatureSpellSlotsConfigurationComponent;
  let fixture: ComponentFixture<CreatureSpellSlotsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellSlotsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellSlotsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
