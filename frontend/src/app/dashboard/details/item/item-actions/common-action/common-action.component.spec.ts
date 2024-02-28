import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonActionComponent} from './common-action.component';

xdescribe('CommonActionComponent', () => {
  let component: CommonActionComponent;
  let fixture: ComponentFixture<CommonActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
