import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityScoreConfigurationDetailsComponent } from './ability-score-configuration-details.component';

xdescribe('AbilityScoreConfigurationDetailsComponent', () => {
  let component: AbilityScoreConfigurationDetailsComponent;
  let fixture: ComponentFixture<AbilityScoreConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityScoreConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityScoreConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
