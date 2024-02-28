import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicItemDetailsComponent} from './basic-item-details.component';

xdescribe('BasicItemDetailsComponent', () => {
  let component: BasicItemDetailsComponent;
  let fixture: ComponentFixture<BasicItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
