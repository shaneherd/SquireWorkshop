import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeedSettingComponent} from './speed-setting.component';

xdescribe('SpeedSettingComponent', () => {
  let component: SpeedSettingComponent;
  let fixture: ComponentFixture<SpeedSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
