import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureEquipmentComponent } from './creature-equipment.component';

xdescribe('CharacterEquipmentComponent', () => {
  let component: CreatureEquipmentComponent;
  let fixture: ComponentFixture<CreatureEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
