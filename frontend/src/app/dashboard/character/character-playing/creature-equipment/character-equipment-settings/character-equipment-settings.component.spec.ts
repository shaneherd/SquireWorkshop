import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEquipmentSettingsComponent } from './character-equipment-settings.component';

xdescribe('CharacterEquipmentSettingsComponent', () => {
  let component: CharacterEquipmentSettingsComponent;
  let fixture: ComponentFixture<CharacterEquipmentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEquipmentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEquipmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
