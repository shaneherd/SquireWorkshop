import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilteringSortingComponent} from './filtering-sorting.component';

xdescribe('FilteringSortingComponent', () => {
  let component: FilteringSortingComponent;
  let fixture: ComponentFixture<FilteringSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteringSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteringSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
