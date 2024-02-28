import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateItemComponent } from './duplicate-item.component';

xdescribe('DuplicateItemComponent', () => {
  let component: DuplicateItemComponent;
  let fixture: ComponentFixture<DuplicateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
