import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SlideInHeaderComponent} from './slide-in-header.component';

xdescribe('SlideInHeaderComponent', () => {
  let component: SlideInHeaderComponent;
  let fixture: ComponentFixture<SlideInHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideInHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideInHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
