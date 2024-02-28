import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityCategoryManageComponent} from './deity-category-manage.component';

xdescribe('DeityCategoryManageComponent', () => {
  let component: DeityCategoryManageComponent;
  let fixture: ComponentFixture<DeityCategoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityCategoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityCategoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
