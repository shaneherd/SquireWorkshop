import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureDamageModifierConfigurationsComponent } from './creature-damage-modifier-configurations.component';

xdescribe('CreatureDamageModifierConfigurationsComponent', () => {
  let component: CreatureDamageModifierConfigurationsComponent;
  let fixture: ComponentFixture<CreatureDamageModifierConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureDamageModifierConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureDamageModifierConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
