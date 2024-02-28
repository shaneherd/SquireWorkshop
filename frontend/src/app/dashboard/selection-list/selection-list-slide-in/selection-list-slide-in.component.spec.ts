import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionListSlideInComponent } from './selection-list-slide-in.component';

xdescribe('SelectionListComponent', () => {
  let component: SelectionListSlideInComponent;
  let fixture: ComponentFixture<SelectionListSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionListSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionListSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
