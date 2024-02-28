import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterInitiativeCardComponent } from './encounter-initiative-card.component';

xdescribe('EncounterInitiativeCardComponent', () => {
  let component: EncounterInitiativeCardComponent;
  let fixture: ComponentFixture<EncounterInitiativeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterInitiativeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterInitiativeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
