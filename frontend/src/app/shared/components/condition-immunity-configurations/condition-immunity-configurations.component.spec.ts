import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionImmunityConfigurationsComponent } from './condition-immunity-configurations.component';

xdescribe('ConditionImmunityConfigurationsComponent', () => {
  let component: ConditionImmunityConfigurationsComponent;
  let fixture: ComponentFixture<ConditionImmunityConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionImmunityConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionImmunityConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
