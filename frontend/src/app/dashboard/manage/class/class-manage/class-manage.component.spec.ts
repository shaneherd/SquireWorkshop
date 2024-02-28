import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClassManageComponent} from './class-manage.component';

xdescribe('ClassManageComponent', () => {
  let component: ClassManageComponent;
  let fixture: ComponentFixture<ClassManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
