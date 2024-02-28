import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentConfigurationSectionComponent } from './starting-equipment-configuration-section.component';

xdescribe('StartingEquipmentConfigurationSectionComponent', () => {
  let component: StartingEquipmentConfigurationSectionComponent;
  let fixture: ComponentFixture<StartingEquipmentConfigurationSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentConfigurationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentConfigurationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
