import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditHealthComponent } from './character-edit-health.component';

xdescribe('CharacterEditHealthComponent', () => {
  let component: CharacterEditHealthComponent;
  let fixture: ComponentFixture<CharacterEditHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
