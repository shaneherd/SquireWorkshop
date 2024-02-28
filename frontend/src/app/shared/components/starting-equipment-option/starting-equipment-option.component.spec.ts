import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentOptionComponent } from './starting-equipment-option.component';

xdescribe('StartingEquipmentOptionComponent', () => {
  let component: StartingEquipmentOptionComponent;
  let fixture: ComponentFixture<StartingEquipmentOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
