import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageModifierConfigurationDetailsComponent } from './damage-modifier-configuration-details.component';

xdescribe('DamageModifierConfigurationDetailsComponent', () => {
  let component: DamageModifierConfigurationDetailsComponent;
  let fixture: ComponentFixture<DamageModifierConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageModifierConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageModifierConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
