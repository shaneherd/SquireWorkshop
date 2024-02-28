import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolCategoryManageComponent} from './tool-category-manage.component';

xdescribe('ToolCategoryManageComponent', () => {
  let component: ToolCategoryManageComponent;
  let fixture: ComponentFixture<ToolCategoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolCategoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCategoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
