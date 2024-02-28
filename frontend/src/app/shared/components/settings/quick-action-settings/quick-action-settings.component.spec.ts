import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuickActionSettingsComponent} from './quick-action-settings.component';

xdescribe('QuickActionSettingsComponent', () => {
  let component: QuickActionSettingsComponent;
  let fixture: ComponentFixture<QuickActionSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickActionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickActionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
