import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageConfigurationSectionComponent } from './damage-configuration-section.component';

xdescribe('DamageConfigurationSectionComponent', () => {
  let component: DamageConfigurationSectionComponent;
  let fixture: ComponentFixture<DamageConfigurationSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageConfigurationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageConfigurationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
