import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditBackgroundComponent } from './character-edit-background.component';

xdescribe('CharacterEditBackgroundComponent', () => {
  let component: CharacterEditBackgroundComponent;
  let fixture: ComponentFixture<CharacterEditBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
