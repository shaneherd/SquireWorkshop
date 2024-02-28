import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureSpellSlotsSlideInComponent } from './creature-spell-slots-slide-in.component';

xdescribe('CharacterSpellSlotsSlideInComponent', () => {
  let component: CreatureSpellSlotsSlideInComponent;
  let fixture: ComponentFixture<CreatureSpellSlotsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureSpellSlotsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureSpellSlotsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
