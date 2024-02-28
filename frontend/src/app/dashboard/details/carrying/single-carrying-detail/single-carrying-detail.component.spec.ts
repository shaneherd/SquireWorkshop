import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCarryingDetailComponent } from './single-carrying-detail.component';

xdescribe('SingleCarryingDetailComponent', () => {
  let component: SingleCarryingDetailComponent;
  let fixture: ComponentFixture<SingleCarryingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCarryingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCarryingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
