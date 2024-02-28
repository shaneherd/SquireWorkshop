import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AcConfigurationComponent} from './ac-configuration.component';

xdescribe('AcConfigurationComponent', () => {
  let component: AcConfigurationComponent;
  let fixture: ComponentFixture<AcConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
