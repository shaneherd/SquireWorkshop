import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionDetailsComponent } from './condition-details.component';

xdescribe('ConditionDetailsComponent', () => {
  let component: ConditionDetailsComponent;
  let fixture: ComponentFixture<ConditionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
