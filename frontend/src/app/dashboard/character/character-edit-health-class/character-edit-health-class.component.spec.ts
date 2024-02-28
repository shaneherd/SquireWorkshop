import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditHealthClassComponent } from './character-edit-health-class.component';

xdescribe('CharacterEditHealthClassComponent', () => {
  let component: CharacterEditHealthClassComponent;
  let fixture: ComponentFixture<CharacterEditHealthClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditHealthClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditHealthClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
