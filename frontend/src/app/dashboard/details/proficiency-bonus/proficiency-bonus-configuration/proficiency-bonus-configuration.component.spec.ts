import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProficiencyBonusConfigurationComponent } from './proficiency-bonus-configuration.component';

xdescribe('ProficiencyBonusConfigurationComponent', () => {
  let component: ProficiencyBonusConfigurationComponent;
  let fixture: ComponentFixture<ProficiencyBonusConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyBonusConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyBonusConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
