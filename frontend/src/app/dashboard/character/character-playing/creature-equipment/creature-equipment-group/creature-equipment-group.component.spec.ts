import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureEquipmentGroupComponent } from './creature-equipment-group.component';

xdescribe('CharacterEquipmentGroupComponent', () => {
  let component: CreatureEquipmentGroupComponent;
  let fixture: ComponentFixture<CreatureEquipmentGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureEquipmentGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureEquipmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
