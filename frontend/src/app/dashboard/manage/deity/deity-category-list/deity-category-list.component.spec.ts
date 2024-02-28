import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityCategoryListComponent} from './deity-category-list.component';

xdescribe('DeityCategoryListComponent', () => {
  let component: DeityCategoryListComponent;
  let fixture: ComponentFixture<DeityCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
