import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignInviteComponent } from './campaign-invite.component';

xdescribe('CampaignInviteComponent', () => {
  let component: CampaignInviteComponent;
  let fixture: ComponentFixture<CampaignInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
