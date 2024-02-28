import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPropertyManageComponent} from './weapon-property-manage.component';

xdescribe('WeaponPropertyManageComponent', () => {
  let component: WeaponPropertyManageComponent;
  let fixture: ComponentFixture<WeaponPropertyManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponPropertyManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPropertyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
