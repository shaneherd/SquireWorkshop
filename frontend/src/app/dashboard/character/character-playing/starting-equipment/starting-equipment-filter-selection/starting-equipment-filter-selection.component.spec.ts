import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentFilterSelectionComponent } from './starting-equipment-filter-selection.component';

xdescribe('StartingEquipmentFilterSelectionComponent', () => {
  let component: StartingEquipmentFilterSelectionComponent;
  let fixture: ComponentFixture<StartingEquipmentFilterSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentFilterSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentFilterSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
