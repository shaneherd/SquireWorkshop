import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShortRestDetailsComponent} from './short-rest-details.component';

xdescribe('ShortRestDetailsComponent', () => {
  let component: ShortRestDetailsComponent;
  let fixture: ComponentFixture<ShortRestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortRestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortRestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
