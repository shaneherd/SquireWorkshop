import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionScoreModifierConfigurationComponent } from './companion-score-modifier-configuration.component';

xdescribe('CompanionScoreModifierConfigurationComponent', () => {
  let component: CompanionScoreModifierConfigurationComponent;
  let fixture: ComponentFixture<CompanionScoreModifierConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionScoreModifierConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionScoreModifierConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
