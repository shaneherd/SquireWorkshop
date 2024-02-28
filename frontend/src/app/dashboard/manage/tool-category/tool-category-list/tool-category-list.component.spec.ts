import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolCategoryListComponent} from './tool-category-list.component';

xdescribe('ToolCategoryListComponent', () => {
  let component: ToolCategoryListComponent;
  let fixture: ComponentFixture<ToolCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
