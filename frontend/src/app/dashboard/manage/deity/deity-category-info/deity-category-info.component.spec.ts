import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityCategoryInfoComponent} from './deity-category-info.component';

xdescribe('DeityCategoryInfoComponent', () => {
  let component: DeityCategoryInfoComponent;
  let fixture: ComponentFixture<DeityCategoryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityCategoryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityCategoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
