import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AmmoDetailsComponent} from './ammo-details.component';

xdescribe('AmmoDetailsComponent', () => {
  let component: AmmoDetailsComponent;
  let fixture: ComponentFixture<AmmoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmmoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
