import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeedDisplayComponent} from './speed-display.component';

xdescribe('SpeedDisplayComponent', () => {
  let component: SpeedDisplayComponent;
  let fixture: ComponentFixture<SpeedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
