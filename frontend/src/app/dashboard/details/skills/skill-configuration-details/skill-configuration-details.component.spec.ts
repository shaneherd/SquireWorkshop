import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillConfigurationDetailsComponent } from './skill-configuration-details.component';

xdescribe('SkillConfigurationDetailsComponent', () => {
  let component: SkillConfigurationDetailsComponent;
  let fixture: ComponentFixture<SkillConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
