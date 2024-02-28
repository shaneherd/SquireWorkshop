import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityScoreIncreaseConfigurationComponent } from './ability-score-increase-configuration.component';

xdescribe('AbilityScoreIncreaseConfigurationComponent', () => {
  let component: AbilityScoreIncreaseConfigurationComponent;
  let fixture: ComponentFixture<AbilityScoreIncreaseConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityScoreIncreaseConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityScoreIncreaseConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
