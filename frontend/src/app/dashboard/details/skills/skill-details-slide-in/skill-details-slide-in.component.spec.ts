import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDetailsSlideInComponent } from './skill-details-slide-in.component';

xdescribe('SkillDetailsComponent', () => {
  let component: SkillDetailsSlideInComponent;
  let fixture: ComponentFixture<SkillDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
