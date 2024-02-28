import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartSlideInComponent } from './shopping-cart-slide-in.component';

xdescribe('ShoppingCartSlideInComponent', () => {
  let component: ShoppingCartSlideInComponent;
  let fixture: ComponentFixture<ShoppingCartSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
