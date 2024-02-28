import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterMonsterGroupSurpriseSlideInComponent } from './encounter-monster-group-surprise-slide-in.component';

xdescribe('EncounterMonsterGroupSurpriseSlideInComponent', () => {
  let component: EncounterMonsterGroupSurpriseSlideInComponent;
  let fixture: ComponentFixture<EncounterMonsterGroupSurpriseSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterMonsterGroupSurpriseSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterMonsterGroupSurpriseSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
