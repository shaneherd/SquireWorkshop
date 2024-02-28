import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackgroundManageComponent} from './background-manage.component';

xdescribe('BackgroundManageComponent', () => {
  let component: BackgroundManageComponent;
  let fixture: ComponentFixture<BackgroundManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
