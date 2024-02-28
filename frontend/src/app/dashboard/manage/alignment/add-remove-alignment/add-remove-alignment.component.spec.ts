import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveAlignmentComponent} from './add-remove-alignment.component';

xdescribe('AddRemoveAlignmentComponent', () => {
  let component: AddRemoveAlignmentComponent;
  let fixture: ComponentFixture<AddRemoveAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
