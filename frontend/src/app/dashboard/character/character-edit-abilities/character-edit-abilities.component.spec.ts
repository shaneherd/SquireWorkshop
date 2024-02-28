import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditAbilitiesComponent } from './character-edit-abilities.component';

xdescribe('CharacterEditAbilitiesComponent', () => {
  let component: CharacterEditAbilitiesComponent;
  let fixture: ComponentFixture<CharacterEditAbilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditAbilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
