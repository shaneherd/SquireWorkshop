import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditHealthClassLevelComponent } from './character-edit-health-class-level.component';

xdescribe('CharacterEditHealthClassLevelComponent', () => {
  let component: CharacterEditHealthClassLevelComponent;
  let fixture: ComponentFixture<CharacterEditHealthClassLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditHealthClassLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditHealthClassLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
