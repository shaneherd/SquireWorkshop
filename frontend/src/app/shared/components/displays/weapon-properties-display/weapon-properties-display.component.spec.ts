import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponPropertiesDisplayComponent} from './weapon-properties-display.component';

xdescribe('WeaponPropertiesDisplayComponent', () => {
  let component: WeaponPropertiesDisplayComponent;
  let fixture: ComponentFixture<WeaponPropertiesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponPropertiesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponPropertiesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
