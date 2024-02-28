import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddAlignmentsComponent} from './add-alignments.component';

xdescribe('AddAlignmentsComponent', () => {
  let component: AddAlignmentsComponent;
  let fixture: ComponentFixture<AddAlignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
