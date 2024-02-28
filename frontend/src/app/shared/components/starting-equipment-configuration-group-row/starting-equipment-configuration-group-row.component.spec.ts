import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentConfigurationGroupRowComponent } from './starting-equipment-configuration-group-row.component';

xdescribe('StartingEquipmentConfigurationGroupRowComponent', () => {
  let component: StartingEquipmentConfigurationGroupRowComponent;
  let fixture: ComponentFixture<StartingEquipmentConfigurationGroupRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentConfigurationGroupRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentConfigurationGroupRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
