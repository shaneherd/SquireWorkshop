import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsListComponent } from './campaigns-list.component';

xdescribe('CampaignsListComponent', () => {
  let component: CampaignsListComponent;
  let fixture: ComponentFixture<CampaignsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
