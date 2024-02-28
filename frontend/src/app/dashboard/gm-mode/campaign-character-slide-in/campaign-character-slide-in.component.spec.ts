import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignCharacterSlideInComponent } from './campaign-character-slide-in.component';

xdescribe('CampaignCharacterSlideInComponent', () => {
  let component: CampaignCharacterSlideInComponent;
  let fixture: ComponentFixture<CampaignCharacterSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignCharacterSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignCharacterSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
