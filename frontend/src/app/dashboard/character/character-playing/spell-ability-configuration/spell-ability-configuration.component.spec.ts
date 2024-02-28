import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellAbilityConfigurationComponent } from './spell-ability-configuration.component';

xdescribe('SpellAbilityConfigurationComponent', () => {
  let component: SpellAbilityConfigurationComponent;
  let fixture: ComponentFixture<SpellAbilityConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellAbilityConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellAbilityConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
