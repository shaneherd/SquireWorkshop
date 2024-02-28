import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackgroundListComponent} from './background-list.component';

xdescribe('BackgroundListComponent', () => {
  let component: BackgroundListComponent;
  let fixture: ComponentFixture<BackgroundListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
