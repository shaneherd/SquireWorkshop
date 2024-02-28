import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterBoxComponent } from './character-box.component';

xdescribe('CharacterBoxComponent', () => {
  let component: CharacterBoxComponent;
  let fixture: ComponentFixture<CharacterBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
