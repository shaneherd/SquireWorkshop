import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSlideInComponent } from './action-slide-in.component';

xdescribe('ActionSlideInComponent', () => {
  let component: ActionSlideInComponent;
  let fixture: ComponentFixture<ActionSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
