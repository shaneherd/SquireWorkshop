import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignmentDetailsComponent } from './alignment-details.component';

xdescribe('AlignmentDetailsComponent', () => {
  let component: AlignmentDetailsComponent;
  let fixture: ComponentFixture<AlignmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
