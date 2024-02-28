import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartCheckoutPageComponent } from './shopping-cart-checkout-page.component';

xdescribe('ShoppingCartCheckoutPageComponent', () => {
  let component: ShoppingCartCheckoutPageComponent;
  let fixture: ComponentFixture<ShoppingCartCheckoutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartCheckoutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartCheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
