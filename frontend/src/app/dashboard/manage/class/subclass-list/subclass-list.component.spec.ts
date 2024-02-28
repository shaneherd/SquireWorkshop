import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubclassListComponent} from './subclass-list.component';

xdescribe('SubclassListComponent', () => {
  let component: SubclassListComponent;
  let fixture: ComponentFixture<SubclassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubclassListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubclassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
