import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveWeaponPropertyComponent} from './add-remove-weapon-property.component';

xdescribe('AddRemoveWeaponPropertyComponent', () => {
  let component: AddRemoveWeaponPropertyComponent;
  let fixture: ComponentFixture<AddRemoveWeaponPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveWeaponPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveWeaponPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
