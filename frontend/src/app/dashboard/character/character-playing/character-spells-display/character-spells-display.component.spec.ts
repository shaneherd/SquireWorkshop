import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSpellsDisplayComponent } from './character-spells-display.component';

xdescribe('CharacterSpellsDisplayComponent', () => {
  let component: CharacterSpellsDisplayComponent;
  let fixture: ComponentFixture<CharacterSpellsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSpellsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSpellsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
