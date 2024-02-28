import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuantityDisplayComponent} from './quantity-display.component';

xdescribe('QuantityDisplayComponent', () => {
  let component: QuantityDisplayComponent;
  let fixture: ComponentFixture<QuantityDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
