import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveItemSimpleComponent} from './add-remove-item-simple.component';

xdescribe('AddRemoveItemSimpleComponent', () => {
  let component: AddRemoveItemSimpleComponent;
  let fixture: ComponentFixture<AddRemoveItemSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveItemSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveItemSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
