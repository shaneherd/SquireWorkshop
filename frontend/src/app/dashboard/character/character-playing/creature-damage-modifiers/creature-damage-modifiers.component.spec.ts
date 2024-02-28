import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureDamageModifiersComponent } from './creature-damage-modifiers.component';

xdescribe('CharacterDamageModifiersComponent', () => {
  let component: CreatureDamageModifiersComponent;
  let fixture: ComponentFixture<CreatureDamageModifiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureDamageModifiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureDamageModifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
