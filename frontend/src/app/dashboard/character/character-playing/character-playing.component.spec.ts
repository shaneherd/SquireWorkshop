import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPlayingComponent } from './character-playing.component';

xdescribe('CharacterPlayingComponent', () => {
  let component: CharacterPlayingComponent;
  let fixture: ComponentFixture<CharacterPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterPlayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
