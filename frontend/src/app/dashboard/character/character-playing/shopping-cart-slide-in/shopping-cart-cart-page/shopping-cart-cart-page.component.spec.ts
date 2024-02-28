import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartCartPageComponent } from './shopping-cart-cart-page.component';

xdescribe('ShoppingCartCartPageComponent', () => {
  let component: ShoppingCartCartPageComponent;
  let fixture: ComponentFixture<ShoppingCartCartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartCartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartCartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
