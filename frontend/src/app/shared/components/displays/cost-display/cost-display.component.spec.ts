import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CostDisplayComponent} from './cost-display.component';

xdescribe('CostDisplayComponent', () => {
  let component: CostDisplayComponent;
  let fixture: ComponentFixture<CostDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
