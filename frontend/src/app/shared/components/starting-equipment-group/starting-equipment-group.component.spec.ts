import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentGroupComponent } from './starting-equipment-group.component';

xdescribe('StartingEquipmentGroupComponent', () => {
  let component: StartingEquipmentGroupComponent;
  let fixture: ComponentFixture<StartingEquipmentGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
