import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentConfigurationComponent } from './starting-equipment-configuration.component';

xdescribe('StartingEquipmentConfigurationComponent', () => {
  let component: StartingEquipmentConfigurationComponent;
  let fixture: ComponentFixture<StartingEquipmentConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
