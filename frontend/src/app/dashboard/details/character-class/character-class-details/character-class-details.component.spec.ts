import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterClassDetailsComponent } from './character-class-details.component';

xdescribe('CharacterClassDetailsComponent', () => {
  let component: CharacterClassDetailsComponent;
  let fixture: ComponentFixture<CharacterClassDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterClassDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterClassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
