import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditChosenClassComponent } from './character-edit-chosen-class.component';

xdescribe('CharacterEditChosenClassComponent', () => {
  let component: CharacterEditChosenClassComponent;
  let fixture: ComponentFixture<CharacterEditChosenClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditChosenClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditChosenClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
