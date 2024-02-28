import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerDamageConfigurationSectionComponent } from './power-damage-configuration-section.component';

xdescribe('PowerDamageConfigurationSectionComponent', () => {
  let component: PowerDamageConfigurationSectionComponent;
  let fixture: ComponentFixture<PowerDamageConfigurationSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerDamageConfigurationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerDamageConfigurationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
