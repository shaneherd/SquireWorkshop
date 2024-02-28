import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlignmentInfoComponent} from './alignment-info.component';

xdescribe('AlignmentInfoComponent', () => {
  let component: AlignmentInfoComponent;
  let fixture: ComponentFixture<AlignmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
