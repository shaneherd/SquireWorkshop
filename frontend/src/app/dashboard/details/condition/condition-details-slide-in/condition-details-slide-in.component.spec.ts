import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionDetailsSlideInComponent } from './condition-details-slide-in.component';

xdescribe('ConditionDetailsComponent', () => {
  let component: ConditionDetailsSlideInComponent;
  let fixture: ComponentFixture<ConditionDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
