import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlignmentManageComponent} from './alignment-manage.component';

xdescribe('AlignmentManageComponent', () => {
  let component: AlignmentManageComponent;
  let fixture: ComponentFixture<AlignmentManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignmentManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
