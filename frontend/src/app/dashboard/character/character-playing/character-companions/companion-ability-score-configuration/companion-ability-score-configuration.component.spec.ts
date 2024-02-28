import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionAbilityScoreConfigurationComponent } from './companion-ability-score-configuration.component';

xdescribe('CompanionAbilityScoreConfigurationComponent', () => {
  let component: CompanionAbilityScoreConfigurationComponent;
  let fixture: ComponentFixture<CompanionAbilityScoreConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionAbilityScoreConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionAbilityScoreConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
