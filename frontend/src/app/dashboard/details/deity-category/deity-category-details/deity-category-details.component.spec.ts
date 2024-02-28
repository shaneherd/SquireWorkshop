import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeityCategoryDetailsComponent } from './deity-category-details.component';

xdescribe('DeityCategoryDetailsComponent', () => {
  let component: DeityCategoryDetailsComponent;
  let fixture: ComponentFixture<DeityCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
