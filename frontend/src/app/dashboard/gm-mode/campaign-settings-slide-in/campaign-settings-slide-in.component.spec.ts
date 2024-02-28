import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSettingsSlideInComponent } from './campaign-settings-slide-in.component';

xdescribe('CampaignSettingsSlideInComponent', () => {
  let component: CampaignSettingsSlideInComponent;
  let fixture: ComponentFixture<CampaignSettingsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSettingsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSettingsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
