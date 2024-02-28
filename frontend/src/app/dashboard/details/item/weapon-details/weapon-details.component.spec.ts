import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponDetailsComponent} from './weapon-details.component';

xdescribe('WeaponDetailsComponent', () => {
  let component: WeaponDetailsComponent;
  let fixture: ComponentFixture<WeaponDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
