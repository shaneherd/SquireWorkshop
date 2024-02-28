import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityScoreIncreaseConfigurationSingleScoreComponent } from './ability-score-increase-configuration-single-score.component';

xdescribe('AbilityScoreIncreaseConfigurationSingleScoreComponent', () => {
  let component: AbilityScoreIncreaseConfigurationSingleScoreComponent;
  let fixture: ComponentFixture<AbilityScoreIncreaseConfigurationSingleScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityScoreIncreaseConfigurationSingleScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityScoreIncreaseConfigurationSingleScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
