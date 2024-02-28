import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveCasterTypeComponent} from './add-remove-caster-type.component';

xdescribe('AddRemoveCasterTypeComponent', () => {
  let component: AddRemoveCasterTypeComponent;
  let fixture: ComponentFixture<AddRemoveCasterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveCasterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveCasterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
