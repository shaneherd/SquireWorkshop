import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AttunedTagComponent} from './attuned-tag.component';

xdescribe('AttunedTagComponent', () => {
  let component: AttunedTagComponent;
  let fixture: ComponentFixture<AttunedTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttunedTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttunedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
