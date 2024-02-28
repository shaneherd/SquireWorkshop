import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSpellInfoSlideInComponent } from './character-spell-info-slide-in.component';

xdescribe('CharacterSpellInfoSlideInComponent', () => {
  let component: CharacterSpellInfoSlideInComponent;
  let fixture: ComponentFixture<CharacterSpellInfoSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSpellInfoSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSpellInfoSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
