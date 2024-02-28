import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCharacteristicsComponent } from './character-characteristics.component';

xdescribe('CharacterCharacteristicsComponent', () => {
  let component: CharacterCharacteristicsComponent;
  let fixture: ComponentFixture<CharacterCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
