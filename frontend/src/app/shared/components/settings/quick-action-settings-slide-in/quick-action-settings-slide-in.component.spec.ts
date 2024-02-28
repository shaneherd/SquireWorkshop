import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuickActionSettingsSlideInComponent} from './quick-action-settings-slide-in.component';

xdescribe('QuickActionSettingsSlideInComponent', () => {
  let component: QuickActionSettingsSlideInComponent;
  let fixture: ComponentFixture<QuickActionSettingsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickActionSettingsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickActionSettingsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
