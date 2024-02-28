import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCompanionConfigureSlideInComponent } from './character-companion-configure-slide-in.component';

xdescribe('CharacterCompanionConfigureSlideInComponent', () => {
  let component: CharacterCompanionConfigureSlideInComponent;
  let fixture: ComponentFixture<CharacterCompanionConfigureSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCompanionConfigureSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCompanionConfigureSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
