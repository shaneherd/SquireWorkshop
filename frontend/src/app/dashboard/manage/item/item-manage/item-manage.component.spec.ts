import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemManageComponent} from './item-manage.component';

xdescribe('ItemManageComponent', () => {
  let component: ItemManageComponent;
  let fixture: ComponentFixture<ItemManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
