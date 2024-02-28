import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonActionGroupComponent} from './button-action-group.component';

xdescribe('ButtonActionGroupComponent', () => {
  let component: ButtonActionGroupComponent;
  let fixture: ComponentFixture<ButtonActionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonActionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonActionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
