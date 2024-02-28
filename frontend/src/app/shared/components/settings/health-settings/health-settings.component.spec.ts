import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HealthSettingsComponent} from './health-settings.component';

xdescribe('HealthSettingsComponent', () => {
  let component: HealthSettingsComponent;
  let fixture: ComponentFixture<HealthSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
