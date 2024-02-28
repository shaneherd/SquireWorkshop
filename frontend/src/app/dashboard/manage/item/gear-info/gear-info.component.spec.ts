import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GearInfoComponent} from './gear-info.component';

xdescribe('GearInfoComponent', () => {
  let component: GearInfoComponent;
  let fixture: ComponentFixture<GearInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
