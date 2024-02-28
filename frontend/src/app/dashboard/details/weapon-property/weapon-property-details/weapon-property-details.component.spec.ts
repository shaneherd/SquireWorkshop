import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponPropertyDetailsComponent } from './weapon-property-details.component';

xdescribe('WeaponPropertyDetailsComponent', () => {
  let component: WeaponPropertyDetailsComponent;
  let fixture: ComponentFixture<WeaponPropertyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponPropertyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
