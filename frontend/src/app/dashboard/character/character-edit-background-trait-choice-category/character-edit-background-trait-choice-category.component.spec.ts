import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditBackgroundTraitChoiceCategoryComponent } from './character-edit-background-trait-choice-category.component';

xdescribe('CharacterEditBackgroundTraitChoiceCategoryComponent', () => {
  let component: CharacterEditBackgroundTraitChoiceCategoryComponent;
  let fixture: ComponentFixture<CharacterEditBackgroundTraitChoiceCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditBackgroundTraitChoiceCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditBackgroundTraitChoiceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
