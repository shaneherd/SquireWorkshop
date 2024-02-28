import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AbilityScoreIncreasesComponent} from './ability-score-increases.component';

xdescribe('AbilityScoreIncreasesComponent', () => {
  let component: AbilityScoreIncreasesComponent;
  let fixture: ComponentFixture<AbilityScoreIncreasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityScoreIncreasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityScoreIncreasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
