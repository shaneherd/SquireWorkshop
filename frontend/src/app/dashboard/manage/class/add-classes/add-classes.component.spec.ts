import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddClassesComponent} from './add-classes.component';

xdescribe('AddClassesComponent', () => {
  let component: AddClassesComponent;
  let fixture: ComponentFixture<AddClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
