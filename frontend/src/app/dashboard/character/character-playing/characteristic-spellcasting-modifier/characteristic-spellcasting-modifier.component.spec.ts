import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicSpellcastingModifierComponent } from './characteristic-spellcasting-modifier.component';

xdescribe('CharacteristicSpellcastingModifierComponent', () => {
  let component: CharacteristicSpellcastingModifierComponent;
  let fixture: ComponentFixture<CharacteristicSpellcastingModifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicSpellcastingModifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicSpellcastingModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
