import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCampaignSlideInComponent } from './join-campaign-slide-in.component';

xdescribe('JoinCampaignSlideInComponent', () => {
  let component: JoinCampaignSlideInComponent;
  let fixture: ComponentFixture<JoinCampaignSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinCampaignSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCampaignSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
