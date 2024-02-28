import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemTypeDisplayComponent} from './item-type-display.component';

xdescribe('ItemTypeDisplayComponent', () => {
  let component: ItemTypeDisplayComponent;
  let fixture: ComponentFixture<ItemTypeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
