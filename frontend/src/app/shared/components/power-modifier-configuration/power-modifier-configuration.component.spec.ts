import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerModifierConfigurationComponent } from './power-modifier-configuration.component';

xdescribe('PowerModifierConfigurationComponent', () => {
  let component: PowerModifierConfigurationComponent;
  let fixture: ComponentFixture<PowerModifierConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerModifierConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerModifierConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
