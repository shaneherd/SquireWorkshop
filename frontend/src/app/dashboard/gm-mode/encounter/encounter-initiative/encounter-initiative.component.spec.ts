import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterInitiativeComponent } from './encounter-initiative.component';

xdescribe('EncounterInitiativeComponent', () => {
  let component: EncounterInitiativeComponent;
  let fixture: ComponentFixture<EncounterInitiativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterInitiativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterInitiativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
