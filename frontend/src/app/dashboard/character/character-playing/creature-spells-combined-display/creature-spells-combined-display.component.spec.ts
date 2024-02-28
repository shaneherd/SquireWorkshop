import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellsCombinedDisplayComponent } from './creature-spells-combined-display.component';

xdescribe('CharacterSpellsCombinedDisplayComponent', () => {
  let component: CreatureSpellsCombinedDisplayComponent;
  let fixture: ComponentFixture<CreatureSpellsCombinedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellsCombinedDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellsCombinedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
