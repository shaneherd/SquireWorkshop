import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveToolCategoryComponent} from './add-remove-tool-category.component';

xdescribe('AddRemoveToolCategoryComponent', () => {
  let component: AddRemoveToolCategoryComponent;
  let fixture: ComponentFixture<AddRemoveToolCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveToolCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveToolCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
