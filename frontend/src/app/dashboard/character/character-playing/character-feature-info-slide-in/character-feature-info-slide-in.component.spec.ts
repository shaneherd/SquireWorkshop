import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFeatureInfoSlideInComponent } from './character-feature-info-slide-in.component';

xdescribe('CharacterFeatureInfoSlideInComponent', () => {
  let component: CharacterFeatureInfoSlideInComponent;
  let fixture: ComponentFixture<CharacterFeatureInfoSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterFeatureInfoSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterFeatureInfoSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
