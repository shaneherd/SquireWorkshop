import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureAbilitySaveCardComponent } from './creature-ability-save-card.component';

xdescribe('CharacterAbilitySaveCardComponent', () => {
  let component: CreatureAbilitySaveCardComponent;
  let fixture: ComponentFixture<CreatureAbilitySaveCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureAbilitySaveCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureAbilitySaveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
