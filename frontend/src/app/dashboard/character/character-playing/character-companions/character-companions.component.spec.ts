import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCompanionsComponent } from './character-companions.component';

xdescribe('CharacterCompanionsComponent', () => {
  let component: CharacterCompanionsComponent;
  let fixture: ComponentFixture<CharacterCompanionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCompanionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCompanionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
