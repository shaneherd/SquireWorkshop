import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSpellInfoSingleCharacteristicComponent } from './character-spell-info-single-characteristic.component';

xdescribe('CharacterSpellInfoSingleCharacteristicComponent', () => {
  let component: CharacterSpellInfoSingleCharacteristicComponent;
  let fixture: ComponentFixture<CharacterSpellInfoSingleCharacteristicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSpellInfoSingleCharacteristicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSpellInfoSingleCharacteristicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
