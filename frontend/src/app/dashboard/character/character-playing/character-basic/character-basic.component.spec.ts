import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterBasicComponent } from './character-basic.component';

xdescribe('CharacterBasicComponent', () => {
  let component: CharacterBasicComponent;
  let fixture: ComponentFixture<CharacterBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
