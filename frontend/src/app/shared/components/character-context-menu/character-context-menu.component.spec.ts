import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterContextMenuComponent } from './character-context-menu.component';

xdescribe('CharacterContextMenuComponent', () => {
  let component: CharacterContextMenuComponent;
  let fixture: ComponentFixture<CharacterContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
