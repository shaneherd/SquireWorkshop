import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCharacterComponent } from './validate-character.component';

xdescribe('ValidateCharacterComponent', () => {
  let component: ValidateCharacterComponent;
  let fixture: ComponentFixture<ValidateCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
