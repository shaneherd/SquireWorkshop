import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdjustmentCardRowComponent} from './adjustment-card-row.component';

xdescribe('AdjustmentCardRowComponent', () => {
  let component: AdjustmentCardRowComponent;
  let fixture: ComponentFixture<AdjustmentCardRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentCardRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
