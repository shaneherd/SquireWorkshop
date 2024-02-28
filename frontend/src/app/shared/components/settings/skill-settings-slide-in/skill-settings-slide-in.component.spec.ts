import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SkillSettingsSlideInComponent} from './skill-settings-slide-in.component';

xdescribe('SkillSettingsSlideInComponent', () => {
  let component: SkillSettingsSlideInComponent;
  let fixture: ComponentFixture<SkillSettingsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillSettingsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillSettingsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
