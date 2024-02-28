import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListMenuComponent} from './list-menu.component';

xdescribe('ListMenuComponent', () => {
  let component: ListMenuComponent;
  let fixture: ComponentFixture<ListMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
