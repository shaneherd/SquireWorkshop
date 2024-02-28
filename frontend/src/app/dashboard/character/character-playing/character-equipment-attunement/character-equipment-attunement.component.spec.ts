import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEquipmentAttunementComponent } from './character-equipment-attunement.component';

xdescribe('CharacterEquipmentAttunementComponent', () => {
  let component: CharacterEquipmentAttunementComponent;
  let fixture: ComponentFixture<CharacterEquipmentAttunementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEquipmentAttunementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEquipmentAttunementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
