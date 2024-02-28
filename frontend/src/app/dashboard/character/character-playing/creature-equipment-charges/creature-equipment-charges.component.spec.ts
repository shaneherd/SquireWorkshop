import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureEquipmentChargesComponent } from './creature-equipment-charges.component';

xdescribe('CharacterEquipmentChargesComponent', () => {
  let component: CreatureEquipmentChargesComponent;
  let fixture: ComponentFixture<CreatureEquipmentChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureEquipmentChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureEquipmentChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
