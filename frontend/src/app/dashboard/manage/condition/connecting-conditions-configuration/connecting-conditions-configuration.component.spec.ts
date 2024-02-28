import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConnectingConditionsConfigurationComponent} from './connecting-conditions-configuration.component';

xdescribe('ConnectingConditionsConfigurationComponent', () => {
  let component: ConnectingConditionsConfigurationComponent;
  let fixture: ComponentFixture<ConnectingConditionsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectingConditionsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectingConditionsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
