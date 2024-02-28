import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveConditionComponent} from './add-remove-condition.component';

xdescribe('AddRemoveConditionComponent', () => {
  let component: AddRemoveConditionComponent;
  let fixture: ComponentFixture<AddRemoveConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
