import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentSelectionGroupComponent } from './starting-equipment-selection-group.component';

xdescribe('StartingEquipmentSelectionGroupComponent', () => {
  let component: StartingEquipmentSelectionGroupComponent;
  let fixture: ComponentFixture<StartingEquipmentSelectionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentSelectionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentSelectionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
