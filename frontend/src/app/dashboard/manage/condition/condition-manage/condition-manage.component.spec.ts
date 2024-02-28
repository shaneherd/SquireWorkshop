import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConditionManageComponent} from './condition-manage.component';

xdescribe('ConditionManageComponent', () => {
  let component: ConditionManageComponent;
  let fixture: ComponentFixture<ConditionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
