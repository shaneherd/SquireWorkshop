import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerModifierConfigurationSectionComponent } from './power-modifier-configuration-section.component';

xdescribe('PowerModifierConfigurationSectionComponent', () => {
  let component: PowerModifierConfigurationSectionComponent;
  let fixture: ComponentFixture<PowerModifierConfigurationSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerModifierConfigurationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerModifierConfigurationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
