import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SkillSettingsComponent} from './skill-settings.component';

xdescribe('SkillSettingsComponent', () => {
  let component: SkillSettingsComponent;
  let fixture: ComponentFixture<SkillSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
