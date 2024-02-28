import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeedConfigurationComponent} from './speed-configuration.component';

xdescribe('SpeedConfigurationComponent', () => {
  let component: SpeedConfigurationComponent;
  let fixture: ComponentFixture<SpeedConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
