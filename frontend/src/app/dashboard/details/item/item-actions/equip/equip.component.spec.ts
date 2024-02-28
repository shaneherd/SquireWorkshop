import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EquipComponent} from './equip.component';

xdescribe('EquipComponent', () => {
  let component: EquipComponent;
  let fixture: ComponentFixture<EquipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
