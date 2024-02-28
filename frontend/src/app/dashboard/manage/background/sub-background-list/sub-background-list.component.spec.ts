import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubBackgroundListComponent} from './sub-background-list.component';

xdescribe('SubBackgroundListComponent', () => {
  let component: SubBackgroundListComponent;
  let fixture: ComponentFixture<SubBackgroundListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubBackgroundListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubBackgroundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
