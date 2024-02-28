import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellsComponent } from './creature-spells.component';

xdescribe('CharacterSpellsComponent', () => {
  let component: CreatureSpellsComponent;
  let fixture: ComponentFixture<CreatureSpellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
