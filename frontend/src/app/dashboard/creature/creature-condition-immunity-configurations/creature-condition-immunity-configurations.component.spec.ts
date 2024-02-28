import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureConditionImmunityConfigurationsComponent } from './creature-condition-immunity-configurations.component';

xdescribe('CreatureConditionImmunityConfigurationsComponent', () => {
  let component: CreatureConditionImmunityConfigurationsComponent;
  let fixture: ComponentFixture<CreatureConditionImmunityConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureConditionImmunityConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureConditionImmunityConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
