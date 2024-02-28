import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveDeityCategoryComponent} from './add-remove-deity-category.component';

xdescribe('AddRemoveDeityCategoryComponent', () => {
  let component: AddRemoveDeityCategoryComponent;
  let fixture: ComponentFixture<AddRemoveDeityCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveDeityCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveDeityCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
