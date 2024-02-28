import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCategoryDetailsComponent } from './tool-category-details.component';

xdescribe('ToolCategoryDetailsComponent', () => {
  let component: ToolCategoryDetailsComponent;
  let fixture: ComponentFixture<ToolCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
