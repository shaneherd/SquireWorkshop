import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveDeityComponent} from './add-remove-deity.component';

xdescribe('AddRemoveDeityComponent', () => {
  let component: AddRemoveDeityComponent;
  let fixture: ComponentFixture<AddRemoveDeityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveDeityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveDeityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
