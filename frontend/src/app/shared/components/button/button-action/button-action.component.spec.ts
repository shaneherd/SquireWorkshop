import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonActionComponent} from './button-action.component';

xdescribe('ButtonActionComponent', () => {
  let component: ButtonActionComponent;
  let fixture: ComponentFixture<ButtonActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
