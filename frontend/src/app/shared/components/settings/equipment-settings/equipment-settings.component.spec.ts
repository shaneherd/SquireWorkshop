import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EquipmentSettingsComponent} from './equipment-settings.component';

xdescribe('EquipmentSettingsComponent', () => {
  let component: EquipmentSettingsComponent;
  let fixture: ComponentFixture<EquipmentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
