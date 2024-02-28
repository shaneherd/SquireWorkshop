import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellModifierConfigurationComponent } from './spell-modifier-configuration.component';

xdescribe('SpellModifierConfigurationComponent', () => {
  let component: SpellModifierConfigurationComponent;
  let fixture: ComponentFixture<SpellModifierConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellModifierConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellModifierConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
