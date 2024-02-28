import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveItemComponent } from './add-remove-item.component';

xdescribe('AddRemoveItemComponent', () => {
  let component: AddRemoveItemComponent;
  let fixture: ComponentFixture<AddRemoveItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
