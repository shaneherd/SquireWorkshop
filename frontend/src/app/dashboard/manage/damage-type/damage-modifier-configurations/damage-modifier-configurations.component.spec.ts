import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DamageModifierConfigurationsComponent} from './damage-modifier-configurations.component';

xdescribe('DamageModifierConfigurationsComponent', () => {
  let component: DamageModifierConfigurationsComponent;
  let fixture: ComponentFixture<DamageModifierConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageModifierConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageModifierConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
