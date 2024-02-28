import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuantityTagComponent} from './quantity-tag.component';

xdescribe('QuantityTagComponent', () => {
  let component: QuantityTagComponent;
  let fixture: ComponentFixture<QuantityTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
