import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RaceDetailsComponent} from './race-details.component';

xdescribe('RaceDetailsComponent', () => {
  let component: RaceDetailsComponent;
  let fixture: ComponentFixture<RaceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
