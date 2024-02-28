import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlignmentListComponent} from './alignment-list.component';

xdescribe('AlignmentListComponent', () => {
  let component: AlignmentListComponent;
  let fixture: ComponentFixture<AlignmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
