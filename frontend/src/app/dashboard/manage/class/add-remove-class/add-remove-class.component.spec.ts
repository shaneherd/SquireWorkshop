import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveClassComponent} from './add-remove-class.component';

xdescribe('AddRemoveClassComponent', () => {
  let component: AddRemoveClassComponent;
  let fixture: ComponentFixture<AddRemoveClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
