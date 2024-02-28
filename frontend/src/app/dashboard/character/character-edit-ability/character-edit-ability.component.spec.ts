import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditAbilityComponent } from './character-edit-ability.component';

xdescribe('CharacterEditAbilityComponent', () => {
  let component: CharacterEditAbilityComponent;
  let fixture: ComponentFixture<CharacterEditAbilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditAbilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditAbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
