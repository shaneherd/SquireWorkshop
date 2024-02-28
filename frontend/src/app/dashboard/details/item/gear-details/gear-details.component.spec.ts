import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GearDetailsComponent} from './gear-details.component';

xdescribe('GearDetailsComponent', () => {
  let component: GearDetailsComponent;
  let fixture: ComponentFixture<GearDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
