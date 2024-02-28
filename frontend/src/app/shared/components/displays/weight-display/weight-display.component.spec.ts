import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeightDisplayComponent} from './weight-display.component';

describe('WeightDisplayComponent', () => {
  let component: WeightDisplayComponent;
  let fixture: ComponentFixture<WeightDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
