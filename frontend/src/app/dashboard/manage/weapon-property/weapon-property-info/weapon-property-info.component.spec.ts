import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPropertyInfoComponent} from './weapon-property-info.component';

xdescribe('WeaponPropertyInfoComponent', () => {
  let component: WeaponPropertyInfoComponent;
  let fixture: ComponentFixture<WeaponPropertyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponPropertyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPropertyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
