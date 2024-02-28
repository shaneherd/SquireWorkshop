import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubRaceListComponent} from './sub-race-list.component';

xdescribe('SubRaceListComponent', () => {
  let component: SubRaceListComponent;
  let fixture: ComponentFixture<SubRaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubRaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
