import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AmmoInfoComponent} from './ammo-info.component';

xdescribe('AmmoInfoComponent', () => {
  let component: AmmoInfoComponent;
  let fixture: ComponentFixture<AmmoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmmoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
