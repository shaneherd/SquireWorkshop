import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterMonsterGroupConfigureSlideInComponent } from './encounter-monster-group-configure-slide-in.component';

xdescribe('EncounterMonsterGroupConfigureSlideInComponent', () => {
  let component: EncounterMonsterGroupConfigureSlideInComponent;
  let fixture: ComponentFixture<EncounterMonsterGroupConfigureSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterMonsterGroupConfigureSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterMonsterGroupConfigureSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
