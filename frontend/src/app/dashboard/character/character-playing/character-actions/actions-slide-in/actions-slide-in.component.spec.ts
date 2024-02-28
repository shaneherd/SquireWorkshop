import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsSlideInComponent } from './actions-slide-in.component';

xdescribe('StandardActionsSlideInComponent', () => {
  let component: ActionsSlideInComponent;
  let fixture: ComponentFixture<ActionsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
