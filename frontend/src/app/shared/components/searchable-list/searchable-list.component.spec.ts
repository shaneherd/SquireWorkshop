import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchableListComponent} from './searchable-list.component';

describe('SearchableListComponent', () => {
  let component: SearchableListComponent;
  let fixture: ComponentFixture<SearchableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
