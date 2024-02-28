import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SlideInComponent} from './slide-in.component';

xdescribe('SlideInComponent', () => {
  let component: SlideInComponent;
  let fixture: ComponentFixture<SlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
