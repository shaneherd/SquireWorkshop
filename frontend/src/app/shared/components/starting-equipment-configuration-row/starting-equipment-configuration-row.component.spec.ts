import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentConfigurationRowComponent } from './starting-equipment-configuration-row.component';

xdescribe('StartingEquipmentConfigurationRowComponent', () => {
  let component: StartingEquipmentConfigurationRowComponent;
  let fixture: ComponentFixture<StartingEquipmentConfigurationRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentConfigurationRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentConfigurationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
