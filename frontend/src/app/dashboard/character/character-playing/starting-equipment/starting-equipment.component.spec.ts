import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingEquipmentComponent } from './starting-equipment.component';

xdescribe('StartingEquipmentComponent', () => {
  let component: StartingEquipmentComponent;
  let fixture: ComponentFixture<StartingEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
