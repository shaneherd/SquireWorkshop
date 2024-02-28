import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SilveredTagComponent} from './silvered-tag.component';

xdescribe('SilveredTagComponent', () => {
  let component: SilveredTagComponent;
  let fixture: ComponentFixture<SilveredTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SilveredTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilveredTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
