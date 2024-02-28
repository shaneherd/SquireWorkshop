import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConditionInfoComponent} from './condition-info.component';

xdescribe('ConditionInfoComponent', () => {
  let component: ConditionInfoComponent;
  let fixture: ComponentFixture<ConditionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
