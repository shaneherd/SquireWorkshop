import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeedSettingsComponent} from './speed-settings.component';

xdescribe('SpeedSettingsComponent', () => {
  let component: SpeedSettingsComponent;
  let fixture: ComponentFixture<SpeedSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
