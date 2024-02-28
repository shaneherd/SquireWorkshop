import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelValueComponent} from './label-value.component';

xdescribe('LabelValueComponent', () => {
  let component: LabelValueComponent;
  let fixture: ComponentFixture<LabelValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
