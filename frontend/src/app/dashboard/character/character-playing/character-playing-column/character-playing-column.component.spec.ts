import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPlayingColumnComponent } from './character-playing-column.component';

xdescribe('CharacterPlayingColumnComponent', () => {
  let component: CharacterPlayingColumnComponent;
  let fixture: ComponentFixture<CharacterPlayingColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterPlayingColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPlayingColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
