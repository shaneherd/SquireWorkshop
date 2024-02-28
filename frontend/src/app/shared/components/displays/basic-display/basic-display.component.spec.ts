import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicDisplayComponent} from './basic-display.component';

xdescribe('BasicDisplayComponent', () => {
  let component: BasicDisplayComponent;
  let fixture: ComponentFixture<BasicDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
