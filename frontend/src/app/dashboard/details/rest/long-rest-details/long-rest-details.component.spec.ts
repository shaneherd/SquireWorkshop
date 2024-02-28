import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LongRestDetailsComponent} from './long-rest-details.component';

xdescribe('LongRestDetailsComponent', () => {
  let component: LongRestDetailsComponent;
  let fixture: ComponentFixture<LongRestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongRestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongRestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
