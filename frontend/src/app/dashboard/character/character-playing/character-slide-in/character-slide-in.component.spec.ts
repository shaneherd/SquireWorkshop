import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSlideInComponent } from './character-slide-in.component';

xdescribe('CharacterSlideInComponent', () => {
  let component: CharacterSlideInComponent;
  let fixture: ComponentFixture<CharacterSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
