import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemDetailsSlideInComponent} from './item-details-slide-in.component';

xdescribe('ItemDetailsComponent', () => {
  let component: ItemDetailsSlideInComponent;
  let fixture: ComponentFixture<ItemDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
