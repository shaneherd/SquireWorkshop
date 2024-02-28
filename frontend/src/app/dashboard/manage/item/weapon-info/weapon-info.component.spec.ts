import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponInfoComponent} from './weapon-info.component';

xdescribe('WeaponInfoComponent', () => {
  let component: WeaponInfoComponent;
  let fixture: ComponentFixture<WeaponInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
