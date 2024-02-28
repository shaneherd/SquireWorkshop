import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdjustmentCardComponent} from './adjustment-card.component';

xdescribe('AdjustmentCardComponent', () => {
  let component: AdjustmentCardComponent;
  let fixture: ComponentFixture<AdjustmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
