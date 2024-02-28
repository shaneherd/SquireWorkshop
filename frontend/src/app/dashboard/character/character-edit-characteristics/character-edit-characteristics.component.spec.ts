import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditCharacteristicsComponent } from './character-edit-characteristics.component';

xdescribe('CharacterEditCharacteristicsComponent', () => {
  let component: CharacterEditCharacteristicsComponent;
  let fixture: ComponentFixture<CharacterEditCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
