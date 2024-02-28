import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResurrectionDetailsComponent } from './resurrection-details.component';

xdescribe('ResurrectionDetailsComponent', () => {
  let component: ResurrectionDetailsComponent;
  let fixture: ComponentFixture<ResurrectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResurrectionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResurrectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
