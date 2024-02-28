import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeedDetailsComponent} from './speed-details.component';

xdescribe('SpeedDetailsComponent', () => {
  let component: SpeedDetailsComponent;
  let fixture: ComponentFixture<SpeedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
