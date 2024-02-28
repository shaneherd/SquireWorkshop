import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPageOrderComponent } from './character-page-order.component';

xdescribe('CharacterPageOrderComponent', () => {
  let component: CharacterPageOrderComponent;
  let fixture: ComponentFixture<CharacterPageOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterPageOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPageOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
