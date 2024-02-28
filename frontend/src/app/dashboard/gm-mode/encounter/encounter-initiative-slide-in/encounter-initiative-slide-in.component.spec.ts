import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterInitiativeSlideInComponent } from './encounter-initiative-slide-in.component';

xdescribe('EncounterInitiativeSlideInComponent', () => {
  let component: EncounterInitiativeSlideInComponent;
  let fixture: ComponentFixture<EncounterInitiativeSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterInitiativeSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterInitiativeSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
