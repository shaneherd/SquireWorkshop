import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPropertyListComponent} from './weapon-property-list.component';

xdescribe('WeaponPropertyListComponent', () => {
  let component: WeaponPropertyListComponent;
  let fixture: ComponentFixture<WeaponPropertyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponPropertyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
