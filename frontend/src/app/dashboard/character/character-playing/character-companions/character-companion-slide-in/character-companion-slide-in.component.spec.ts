import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCompanionSlideInComponent } from './character-companion-slide-in.component';

xdescribe('CharacterCompanionSlideInComponent', () => {
  let component: CharacterCompanionSlideInComponent;
  let fixture: ComponentFixture<CharacterCompanionSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCompanionSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCompanionSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
