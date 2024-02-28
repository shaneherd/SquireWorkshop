import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolCategoryInfoComponent} from './tool-category-info.component';

xdescribe('ToolCategoryInfoComponent', () => {
  let component: ToolCategoryInfoComponent;
  let fixture: ComponentFixture<ToolCategoryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolCategoryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCategoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
