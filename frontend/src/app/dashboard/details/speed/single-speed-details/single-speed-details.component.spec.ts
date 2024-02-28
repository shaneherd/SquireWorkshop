import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSpeedDetailsComponent } from './single-speed-details.component';

xdescribe('SingleSpeedDetailsComponent', () => {
  let component: SingleSpeedDetailsComponent;
  let fixture: ComponentFixture<SingleSpeedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSpeedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSpeedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
